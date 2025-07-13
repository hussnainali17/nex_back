const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:true,
        match:/^\S+@\S+\.\S+$/
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    role: {
    type: String,
    enum: ['investor', 'entrepreneur'],
    required: true,
  },
   profile: { type: mongoose.Schema.Types.ObjectId,
     refPath: 'role' },
     
    createdAt: {
        type: Date,
        default: Date.now
    },
    verified: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.generateAuthToken=function(){
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

userSchema.statics.hashPassword=async function(password){
    return await bcrypt.hash(password,10);
}

userSchema.methods.comparePassword=async function(Password){
    return await bcrypt.compare(Password,this.password);
}

// Prevent OverwriteModelError in development or hot-reload environments
const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = User;