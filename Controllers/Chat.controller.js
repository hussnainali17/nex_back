const Chat = require('../Models/Chat.model');
const User = require('../Models/user.model');
const Entrepreneur = require('../Models/Entrepreneur.model');
const Investor = require('../Models/Investor.model');

module.exports.getMessage =async (req, res) => {
    const { userId1, userId2 } = req.params;
    try {
        const messages = await Chat.find({
            $or: [
                { sender: userId1, receiver: userId2 },
                { sender: userId2, receiver: userId1 }
            ]
        }).sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
}

module.exports.createChat = async (req, res) => {
    const { sender, receiver, content } = req.body;
    if (!sender || !receiver || !content) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const chat = await Chat.create({
            sender,
            receiver,
            content
        });
        res.status(201).json(chat);
    } catch (err) {
        res.status(500).json({ error: 'Error creating chat' });
    }
}


module.exports.getInteractedUsers = async (req, res) => {
    const { userId } = req.params;
    try {
        const chats = await Chat.find({
            $or: [{ sender: userId }, { receiver: userId }]
        }).populate('sender receiver', 'name _id role');

        // Extract interacted users (sender ≠ userId ? sender : receiver)
        const allUsers = chats.map(chat => (
            chat.sender._id.toString() === userId ? chat.receiver : chat.sender
        ));

        // Remove duplicates based on _id using a Map
        const uniqueUsersMap = new Map();
        allUsers.forEach(user => {
            uniqueUsersMap.set(user._id.toString(), user);
        });
        const uniqueUsers = Array.from(uniqueUsersMap.values());

        // Fetch profile for each user based on role
        const usersWithProfile = await Promise.all(uniqueUsers.map(async user => {
            let profile = null;
            if (user.role === 'entrepreneur') {
                profile = await Entrepreneur.findOne({ user: user._id });
            } else if (user.role === 'investor') {
                profile = await Investor.findOne({ user: user._id });
            }
            return {
                _id: user._id,
                name: user.name,
                role: user.role,
                profile: profile || null
            };
        }));

        res.json(usersWithProfile);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching interacted users' });
    }
};


// module.exports.getInteractedUsers = async (req, res) => {
//     const { userId } = req.params;
    
//     try {
//         const chats = await Chat.find({
//             $or: [{ sender: userId }, { receiver: userId }]
//         }).populate('sender receiver', 'name _id');
        
//         const interactedUsers = chats.map(chat => {
//             return chat.sender._id.toString() === userId ? chat.receiver : chat.sender;
//         });

//         res.json(interactedUsers);
//     } catch (err) {
//         res.status(500).json({ error: 'Error fetching interacted users' });
//     }
// }