import { Router } from 'express';
import Challenge from '../models/challenge_model.js'; // For fetching test cases
import { Submission } from '../models/submission_model.js'; // Assuming the model is exported correctly
import User from '../models/user_model.js'; // For validation
import * as amqplib from 'amqplib';
import express from 'express';
import { store, activeConnections } from '../../app.js';
import { WebSocket } from 'ws';

const { Connection, Message } = amqplib;

const router = express.Router();

// Route for submitting code
router.post('/', async (req, res) => {
  try {
    const { userid, clientId, sessionId, usercode, test_cases } = req.body;

    // Prepare the submission data in the format expected by the Python script
    const submissionData = {
      userid,
      clientId,
      sessionId,
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

// Modify the results route to use the activeConnections map
router.post('/results', (req, res) => {
  const { clientId, sessionId, results } = req.body;

  const sessionConnections = activeConnections.get(sessionId);
  if (sessionConnections && sessionConnections.has(clientId)) {
    const ws = sessionConnections.get(clientId);
    sendResultsToClient(ws, results);
    console.log(`Results sent to client ${clientId}`);
    res.status(200).json({ message: 'Results sent successfully' });
  } else {
    console.log(`No client found for clientId: ${clientId} in session: ${sessionId}`);
    res.status(404).json({ message: 'Client connection not found' });
  }
});

// Helper function to send results to client
function sendResultsToClient(ws, results) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ results }));
  } else {
    console.log('WebSocket is not in OPEN state');
  }
}

export default router;