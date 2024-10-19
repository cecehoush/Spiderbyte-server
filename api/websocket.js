import WebSocket from 'ws';

let ws;  // Declare the WebSocket variable

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:8000');
    
    ws.on('open', () => {
        console.log('Connected to Python WebSocket server');
    });

    ws.on('message', (data) => {
        console.log('Message from Python:', data);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });
}

function sendToWebSocket(data) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
    } else {
        console.error('WebSocket is not open. Cannot send data.');
    }
}

// Export the connect and send functions
export { connectWebSocket, sendToWebSocket };
