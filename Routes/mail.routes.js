const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const userModel = require('../Models/user.model');


router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
  
    const { name, email, password, role } = decoded;

    // Check again (email might have just been verified)
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?alreadyVerified=true`);
    }
    const hashedPassword=await userModel.hashPassword(password);
    const newUser = await userModel.create({
      name,
      email,
      password:hashedPassword,
      role,
      verified: true
    });
    const token1 = newUser.generateAuthToken();
    res.cookie('token', token1, {
          httpOnly: true, // Prevents client-side JavaScript access
          sameSite: 'Strict', // Or 'Lax' depending on your needs
          path: '/', // Cookie valid for the entire domain
          //expires: new Date(Date.now() + 3600000) // Optional: set expiration time (1 hour)
        });

    res.redirect(`${process.env.FRONTEND_URL}/verify-email?verified=true&role=${role}&token=${token1}&userId=${newUser._id}`);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Email verification failed.' });
  }
});

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const jwt = require('jsonwebtoken');
// const userModel = require('../Models/user.model');

// // routes/auth.js
// router.get('/verify-email', async (req, res) => {
//   const { token } = req.query;
//   try {
//     const decoded = jwt.verify(token, process.env.EMAIL_VERIFY_SECRET);
//     const user = await userModel.findById(decoded.userId);
//     if (!user) return res.status(404).send('User not found');

//     user.verified = true;
//     await user.save();

//     res.json({ message: 'Email verified successfully' });
//   } catch (err) {
//     res.json({ message: 'Verification failed or token expired' });
//   }
// });

// module.exports = router;
