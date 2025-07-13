const userModel = require('../Models/user.model');

module.exports.createUser = async ({ name, email, password, role }) => {
    if(!name || !email || !password || !role) {
        throw new Error('All fields are required');
    }
    const user=await userModel.create({
        name:name,
        email:email,
        password:password,
        role:role
    });
    return user;

};
