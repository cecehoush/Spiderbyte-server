import { Router } from 'express';
import { Challenge } from '../models/problem_model.js'; // For fetching test cases
import { Submission } from '../models/submission_model.js'; // Assuming the model is exported correctly
import User from '../models/user_model.js'; // For validation
import * as amqplib from 'amqplib';
import express from 'express';
const { Connection, Message } = amqplib;

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userid, problemid, code, language } = req.body;

    // Validate the request data against Mongoose models
    const user = await User.findById(userid);
    const challenge = await Challenge.findById(problemid);

    if (!user ||!challenge) {
      return res.status(404).send('User or Challenge not found');
    }

    // Check if the submitted language is supported by the challenge
    if (!challenge.languages_supported.includes(language)) {
      return res.status(400).send('Submitted language is not supported for this challenge');
    }

    // Fetch the relevant test cases for the challenge and language
    const relevantTestCases = challenge.question_testcases.filter((testcase) => testcase.language === language);

    // Prepare the submission data
    const submissionData = {
      userid,
      problemid,
      code,
      language,
      testCases: relevantTestCases.map((testcase) => ({ input: testcase.input, expectedOutput: testcase.output })),
    };

    // Connect to RabbitMQ (consider using a connection pool for production)
    const rabbitUrl = 'amqp://localhost:5672'; // default RabbitMQ URL
    const connection = await Connection.open(rabbitUrl);
    const channel = await connection.createChannel();

    // Declare the exchange and queue if they don't exist (adjust as necessary)
    await channel.assertExchange('leetcode_exchange', 'direct', { durable: true });
    await channel.assertQueue('submissions_queue', { durable: true });
    await channel.bindQueue('submissions_queue', 'leetcode_exchange', '', '', true);

    // Send the submission data to RabbitMQ
    channel.sendToQueue('submissions_queue', Buffer.from(JSON.stringify(submissionData)), {
      persistent: true, // For durability
    });

    // Close the RabbitMQ connection (later manage connections more efficiently)
    await connection.close();

    // Create a new Submission document to track the submission (before execution)
    const newSubmission = new Submission({
      user_id: userid,
      problem_id: problemid,
      code,
      language,
    });              
    await newSubmission.save();

    res.json({ message: 'Submission sent to queue successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to process submission');
  }
});

export default router;