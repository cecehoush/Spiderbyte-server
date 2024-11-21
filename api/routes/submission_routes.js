import { Router } from 'express';
import Challenge from '../models/challenge_model.js'; // For fetching test cases
import { Submission } from '../models/submission_model.js'; // Assuming the model is exported correctly
import User from '../models/user_model.js'; // For validation
import * as amqplib from 'amqplib';
import express from 'express';
import { store }  from '../../app.js';  // Import the store from app.js

const { Connection, Message } = amqplib;

const router = express.Router();

// Route for submitting code
router.post('/', async (req, res) => {
  try {
    const { userid, clientId, sessionId, code, test_cases, challenge, challenge_name } = req.body;

    // Prepare the submission data in the format expected by the Python script
    const submissionData = {
      userid,
      clientId,
      sessionId,
      code,
      test_cases,
      challenge_name,
      challenge, // Include the optional challenge field
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
    }, (err) => {
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

    const submission = await Submission.create(req.body);

    
    // Respond with success
    res.json({ message: 'Code submission sent to queue successfully and saved to the database' });
  } catch (error) {
    console.error('Failed to send message to RabbitMQ:', error);
    res.status(500).send('Failed to send submission to queue');
  }
});

// Route for handling results from the microservice 
router.post('/results', (req, res) => {
  const { clientId, sessionId, results } = req.body; // Accept clientId and results

  console.log('In results:', sessionId)
  store.get(sessionId, (err, session) => {
      if (err || !session) {
        console.log('Session not found:', err);
        return res.status(404).send('Session not found');
      }

      // Log the session data and client connections
      if (session.clientConnections && session.clientConnections[clientId]) {
        const clientConnection = session.clientConnections[clientId]; // Retrieve the WebSocket from session
        
        // Send results to the client
        sendResultsToClient(clientConnection, results);
        console.log("client socket", clientSocket);
        console.log(`Results sent to client for clientId: ${clientId}`);
    }  else {
      console.log(`No client found for clientId: ${clientId}`);
    }
  });
});

// Function to send results to a specific client
function sendResultsToClient(ws, results) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ results }));
  } else {
    console.log(`WebSocket is not open for the client.`);
  }
}


router.get('/', async (req, res) => {
  try {
    const submissions = await Submission.find();

    res.status(200).json(submissions);
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    res.status(500);
  }
});

router.get('/:title', async (req, res) => {
  try {

    const { title } = req.params;

    const submissions = await Submission.findOne({challenge_name: title})

    if(submissions !== null){
      return res.status(200).json(submissions);
    }
    else return res.status(404);

    
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    res.status(500);
  }
});

router.put('/:title', async (req, res) => {
  try {
    const { title } = req.params;
    const { user_id, challenge_id, code, language, valid_solution, submitted_at, execution_time, error_messages } = req.body;

    // Find the submission by title
    const submission = await Submission.findOne({ challenge_name: title });

    if (!submission) {
      return res.status(404).send('Submission not found');
    }
    // Update only the populated fields
    if (user_id !== undefined) submission.user_id = user_id;
    if (challenge_id !== undefined) submission.challenge_id = challenge_id;
    if (code !== undefined) submission.code = code;
    if (language !== undefined) submission.language = language;
    if (valid_solution !== undefined) submission.valid_solution = valid_solution;
    if (submitted_at !== undefined) submission.submitted_at = submitted_at;
    if (execution_time !== undefined) submission.execution_time_ms = execution_time;
    if (error_messages !== undefined) submission.error_messages = error_messages;

    // Save the updated submission
    await submission.save();

    res.status(200).send('Submission updated successfully');
  } catch (error) {
    console.error('Failed to update submission:', error);
    res.status(500).send('Failed to update submission');
  }
});

export default router;