const express=require('express');
const router=express.Router();
const { body } = require('express-validator');

const profileController=require('../Controllers/Profile.controller');
const { authUser } = require('../middlewares/auth.middleware');



router.get('/allentrepreneurs',authUser, profileController.getAllEntrepreneurs);
router.get('/allinvestors',authUser, profileController.getAllInvestors);

router.get('/:userId',authUser, profileController.getProfile);


router.post('/:userId',[
    body('bio').isLength({ min: 10 }).withMessage('Bio must be at least 10 characters long'),
    body('startupName').optional().isLength({ min: 3 }).withMessage('Startup name must be at least 3 characters long'),
    body('startupDescription').optional().isLength({ min: 10 }).withMessage('Startup description must be at least 10 characters long'),
    body('fundingNeed').optional().isNumeric().withMessage('Funding need must be a number'),
    body('pitchDeckLink').optional().isURL().withMessage('Pitch deck link must be a valid URL')
],authUser,profileController.updateProfile);







module.exports = router;