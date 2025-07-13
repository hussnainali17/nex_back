const express = require('express');
const router = express.Router();
const collabController = require('../Controllers/Request.controller');
const { authUser } = require('../middlewares/auth.middleware');

// Investor sends request
router.post('/send', authUser, collabController.sendRequest);
router.get('/sent/:userId', authUser, collabController.getSentRequests);
router.get('/collaborators/:userId', authUser, collabController.getCollaborators);

// router.get('/status/:id/:userId', authUser, collabController.getRequestStatus);

// Entrepreneur views requests sent to them
router.get('/view/:entrepreneurId', authUser, collabController.getRequestsForEntrepreneur);

// Entrepreneur updates request status
router.patch('/update/:id', authUser, collabController.updateRequestStatus);


module.exports = router;
