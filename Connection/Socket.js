// socket.js
const socketIO = require('socket.io');
const Message = require('../Models/Chat.model'); // adjust path if needed

function setupSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('⚡ New client connected');

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their room`);
        });

        socket.on('send_message', async ({ sender, receiver, content }) => {
            const newMessage = new Message({ sender, receiver, content });
            await newMessage.save();

            // Emit to both users
            io.to(sender).emit('receive_message', newMessage);
            io.to(receiver).emit('receive_message', newMessage);
        });

        socket.on('disconnect', () => {
            console.log(' Client disconnected');
        });
    });

    return io;
}

module.exports = setupSocket;
