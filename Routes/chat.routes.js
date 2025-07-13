// routes/chat.route.js
const express = require('express');
const router = express.Router();
const Chat = require('../Models/Chat.model');
const ChatController = require('../Controllers/Chat.controller');
const { authUser } = require('../middlewares/auth.middleware');

router.get('/getInteractedUsers/:userId', authUser, ChatController.getInteractedUsers);

router.post('/', authUser, ChatController.createChat);
// GET messages between two users
router.get('/:userId1/:userId2', authUser, ChatController.getMessage);




module.exports = router;
