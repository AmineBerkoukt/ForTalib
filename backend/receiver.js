import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

// User-specific information
const userId = '675f0eb28d24f46ee0b65633'; // Receiver's ID

// Register the receiver and listen for messages
socket.on('connect', () => {
    console.log('Receiver connected to server:', socket.id);

    // Register the user on the server
    socket.emit('registerUser', { userId });

    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
        console.log('Message received:', data);
    });
});

socket.on('disconnect', () => {
    console.log('Receiver disconnected from server');
});
