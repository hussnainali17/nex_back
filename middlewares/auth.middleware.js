const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');

module.exports.authUser=async (req,res,next)=>{
    const token=req.cookies.token || req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({error:'Unauthorized-1'});
    }
    
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded._id);
        req.user=user;
        next();
    }
    catch(err){
        return res.status(401).json({error:'Unauthorized-3'});
    }}