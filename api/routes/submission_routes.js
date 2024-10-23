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
    const { userid, usercode, test_cases } = req.body;

    // Prepare the submission data in the format expected by the Python script
    const submissionData = {
      userid,
      usercode,
      test_cases,
    };

    // Connect to RabbitMQ
    const rabbitUrl = 'amqp://localhost:5672'; // default RabbitMQ URL
    const connection = await amqplib.connect(rabbitUrl); 
    const channel = await connection.createConfirmChannel(); // Create confirm channel

    // Declare the queue (optional but recommended to ensure it exists)
    await channel.assertQueue('code_queue', {
      durable: true, // Ensures the queue survives RabbitMQ restarts
    });

    // Send the message to the queue
    console.log('Sending message to code_queue...');
    channel.sendToQueue('code_queue', Buffer.from(JSON.stringify(submissionData)), {
      persistent: true, // Ensures the message is saved even if RabbitMQ restarts
    }, (err, ok) => {
      if (err) {
        console.error('Message was not sent:', err);
        return res.status(500).send('Failed to send submission to queue');
      }

      console.log('Message sent successfully');
    });

    // Close the channel and connection
    await channel.waitForConfirms(); // Wait for message confirmation
    await channel.close();
    await connection.close();

    // Respond with success
    res.json({ message: 'Code submission sent to queue successfully' });
  } catch (error) {
    console.error('Failed to send message to RabbitMQ:', error);
    res.status(500).send('Failed to send submission to queue');
  }
});

export default router;
