const {validationResult}=require('express-validator');
const userServices=require('../Services/user.service');
const userModel=require('../Models/user.model');
const bcrypt=require('bcrypt');
const sendVerificationEmail = require('../Services/mail.service');
const jwt = require('jsonwebtoken');


module.exports.signup=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name,email,password,role}=req.body;
        const existingUser=await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }
        
        // const hashedPassword=await userModel.hashPassword(password);
        
        // const newUser= await userServices.createUser({
        //     name,
        //     email,
        //     password:hashedPassword,
        //     role,
        //     verified: false // Set verified to false initially
        // });
       // const token=newUser.generateAuthToken();

// Create a token that holds user data (but do not save to DB yet)
  const emailToken = jwt.sign(
    { name, email, password , role },
    process.env.EMAIL_VERIFY_SECRET,
    { expiresIn: '1h' }
  );

  // Send the token via email
  await sendVerificationEmail(email, emailToken);


        // res.cookie('token', token, {
        //   httpOnly: true, // Prevents client-side JavaScript access
        //   sameSite: 'Strict', // Or 'Lax' depending on your needs
        //   path: '/', // Cookie valid for the entire domain
        //   //expires: new Date(Date.now() + 3600000) // Optional: set expiration time (1 hour)
        // }); 
       return res.status(200).json({ message: 'Verification email sent. Please verify to complete registration.' });

}

module.exports.login=async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    
    const {email,password}=req.body;
    
    try {
        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid email or password"});
        }

        const isMatch=await user.comparePassword(password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid email or password"});
        }

    
        const token=user.generateAuthToken();
        res.cookie('token', token, {
          httpOnly: true, // Prevents client-side JavaScript access
          sameSite: 'Lax', // Or 'Lax' depending on your needs
          path: '/', // Cookie valid for the entire domain
          //expires: new Date(Date.now() + 3600000) // Optional: set expiration time (1 hour)
        });
        
        res.status(200).json({token,user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"});
    }
}



module.exports.logout=async (req,res)=>{
    console.log('User logout initiated');
    res.clearCookie('token')
    res.status(200).json({message:'Logout successful'});
}





// module.exports.signup=async (req,res)=>{
//     const errors=validationResult(req);
//     if(!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()});
//     }

//     const {name,email,password,role}=req.body;
//         const existingUser=await userModel.findOne({email});
//         if(existingUser){
//             return res.status(400).json({message:"User already exists"});
//         }
        
//         const hashedPassword=await userModel.hashPassword(password);
        
//         // const newUser= await userServices.createUser({
//         //     name,
//         //     email,
//         //     password:hashedPassword,
//         //     role,
//         //     verified: false // Set verified to false initially
//         // });
//         const token=newUser.generateAuthToken();

//         // ✅ Create email verification token (JWT)
//     const emailToken = jwt.sign(
//       { userId: newUser._id },
//       process.env.EMAIL_VERIFY_SECRET || 'emailsecret',
//       { expiresIn: '1h' }
//     );

//     // ✅ Send verification email
//     await sendVerificationEmail(newUser.email, emailToken);


//         res.cookie('token', token, {
//           httpOnly: true, // Prevents client-side JavaScript access
//           sameSite: 'Strict', // Or 'Lax' depending on your needs
//           path: '/', // Cookie valid for the entire domain
//           //expires: new Date(Date.now() + 3600000) // Optional: set expiration time (1 hour)
//         }); 
//         res.status(201).json({token,newUser, message: 'User created successfully. Please verify your email.'});

// }
