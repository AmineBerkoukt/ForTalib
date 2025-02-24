export const handleConnection = (socket, io, users) => {

    // Listen for a user regestration (data to receive is the userId)
    socket.on('registerUser', ({ userId }) => {
        users[userId] = socket.id; // Store the userId with the socket ID
        console.log(`User registered: ${userId} -> ${socket.id}`);
        console.log('Current users map:', users); // Log the users map
    });

    // Handle incoming messages
    // Sokcet listenning to incoming messages
    socket.on('sendMessage', async (data) => {
        try {
            const { senderId, receiverId, content } = data;

            console.log('Incoming message data:', data); // Debug message payload

            // Check if the receiver is online
            const receiverSocketId = users[receiverId];
            if (receiverSocketId) {
                console.log(`Sending message to receiver (${receiverId}) with socketId: ${receiverSocketId}`);
                io.to(receiverSocketId).emit('receiveMessage', {
                    content,
                });
            } else {
                console.log(`Receiver (${receiverId}) is offline.`);
            }

            // Notify the sender that the message was sent
            socket.emit('messageSent', { status: 'Message delivered', data: content });
        } catch (error) {
            console.error('(SocketController) : Error sending message:', error);
            socket.emit('error', { message: 'Failed to send message', error });
        }
    });
};
