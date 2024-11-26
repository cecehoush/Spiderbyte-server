import Challenge from "../models/challenge_model.js";
import Subject from "../models/subject_model.js";
import * as amqplib from "amqplib";
import cron from "node-cron";

import mongoose from "mongoose";

export async function getChallenges(req, res) {
  try {
    const challenges = await Challenge.find();
    return res.status(200).json(challenges);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function getChallengeByName(req, res) {
  try {
    const challenge = await Challenge.findOne({
      challenge_title: req.params.title,
    });

    if (challenge !== null) {
      return res.status(200).json(challenge);
    } else return res.status(404);
  } catch (err) {
    console.error("Failed to fetch challenges:", err);
    return res.status(500);
  }
}

export async function createChallenge(req, res) {
  try {
    // Transform the incoming data to match schema structure
    const challengeData = {
      challenge_title: req.body.challenge_title,
      challenge_description: {
        description: req.body.challenge_description.description,
        input_format: req.body.challenge_description.input_format,
        output_format: req.body.challenge_description.output_format,
        constraints: req.body.challenge_description.constraints,
      },
      challenge_difficulty: req.body.challenge_difficulty,
      languages_supported: req.body.language_supported, // Note the field name difference
      content_tags: req.body.content_tags,
      skeleton_code: {
        language: req.body.skeleton_code.language,
        code: req.body.skeleton_code.code,
      },
      hints: req.body.hints,
      test_cases: req.body.test_cases.map((testCase) => ({
        inputs: testCase.inputs,
        expected_output: JSON.stringify(testCase.expected_output), // Convert array to string
      })),
    };

    // Validate required fields
    const requiredFields = [
      "challenge_title",
      "challenge_description",
      "challenge_difficulty",
      "languages_supported",
      "skeleton_code",
      "test_cases",
    ];

    for (const field of requiredFields) {
      if (!challengeData[field]) {
        return res
          .status(400)
          .json({ error: `Missing required field: ${field}` });
      }
    }

    // Additional validation
    if (
      challengeData.challenge_difficulty < 1 ||
      challengeData.challenge_difficulty > 10
    ) {
      return res.status(400).json({
        error: "Challenge difficulty must be between 1 and 10",
      });
    }

    // Create the challenge
    const challenge = await mongoose.model("Challenge").create(challengeData);

    return res.status(201).json({
      message: "Challenge created successfully",
      challenge: challenge,
    });
  } catch (err) {
    console.error("Error creating challenge:", err);
    return res.status(500).json({
      error: "Failed to create challenge",
      details: err.message,
    });
  }
}

// Route to get the first 20 challenges
export async function getSomeChallenges(req, res) {
  try {
    const challenges = await Challenge.find().limit(20);
    return res.status(200).json(challenges);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

// Route to get a specific challenge by its ID
export async function getChallengeById(req, res) {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ error: "Challenge not found" });
    }
    return res.status(200).json(challenge);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
}

export async function createNewChallenge(req, res) {
  try {
    const { userid, subject_tags, difficulty, content_tags, challenge_title } =
      req.body;

    // Data to send to RabbitMQ
    const data = {
      userid,
      subject_tags,
      difficulty,
      content_tags,
      challenge_title,
    };

    const rabbitUrl = "amqp://localhost:5672"; // RabbitMQ URL
    const connection = await amqplib.connect(rabbitUrl);
    const channel = await connection.createChannel();

    // Declare the request queue
    const queueName = "challenge_queue";
    await channel.assertQueue(queueName, { durable: true });

    // Create a temporary reply queue
    const replyQueue = await channel.assertQueue("", { exclusive: true });

    // Generate a unique correlation ID
    const correlationId = generateUuid();

    // Listen for responses
    channel.consume(
      replyQueue.queue,
      async (msg) => {
        if (msg.properties.correlationId === correlationId) {
          const challengeName = msg.content.toString();
          console.log("Received response:", challengeName);

          try {
            // Find the challenge by title
            const challenge = await Challenge.findOne({
              challenge_title: challengeName,
            });
            if (!challenge) {
              console.error("Challenge not found");
              return res.status(404).json({ error: "Challenge not found" });
            }

            // Respond with the challenge ID
            res.status(200).json({ challengeID: challenge._id });
          } catch (err) {
            console.error("Error finding challenge:", err);
            res.status(500).json({ error: "Error finding challenge" });
          } finally {
            // Close the channel and connection
            channel.close();
            connection.close();
          }
        }
      },
      { noAck: true }
    );

    console.log("Creating a challenge for the user...");

    // Send the message to the queue
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
      correlationId,
      replyTo: replyQueue.queue,
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Helper function to generate a unique correlation ID
function generateUuid() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function getDailyChallenge(req, res) {
  try {
    const today = new Date();
    const dailyChallenge = await Challenge.findOne({
      daily_challenge: {
        $gte: new Date(today.setHours(0, 0, 0, 0)), // Start of day
        $lt: new Date(today.setHours(23, 59, 59, 999)), // End of day
      },
    });

    if (!dailyChallenge) {
      // Fetch all challenges
      const challenges = await Challenge.find({});
      // Randomly select a challenge and set it as the daily challenge
      const randomChallenge =
        challenges[Math.floor(Math.random() * challenges.length)];
      randomChallenge.daily_challenge = new Date();
      await randomChallenge.save();
      res.status(200).json({ challengeID: randomChallenge._id });

      console.log("Daily challenge updated:", randomChallenge.challenge_title);
    }

    res.status(200).json({ challengeID: dailyChallenge._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

cron.schedule("0 0 * * *", async () => {
  try {
    const today = new Date();

    // Check if a daily challenge is already set for today
    const existingChallenge = await Challenge.findOne({
      daily_challenge: {
        $gte: new Date(today.setHours(0, 0, 0, 0)), // Start of day
        $lt: new Date(today.setHours(23, 59, 59, 999)), // End of day
      },
    });

    if (existingChallenge) {
      console.log(
        "Daily challenge already exists for today:",
        existingChallenge.challenge_title
      );
      return; // Exit if a challenge is already set
    }

    // Fetch all challenges
    const challenges = await Challenge.find({});
    if (challenges.length === 0) {
      console.log("No challenges available to set as daily challenge.");
      return;
    }

    // Randomly select a challenge and set it as the daily challenge
    const randomChallenge =
      challenges[Math.floor(Math.random() * challenges.length)];
    randomChallenge.daily_challenge = new Date();
    await randomChallenge.save();

    console.log("Daily challenge updated:", randomChallenge.challenge_title);
  } catch (error) {
    console.error("Error updating daily challenge:", error);
  }
});
