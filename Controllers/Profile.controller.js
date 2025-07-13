const User = require('../Models/user.model');
const Entrepreneur = require('../Models/Entrepreneur.model');
const Investor = require('../Models/Investor.model');

module.exports.getProfile = async (req, res) => {
  
  try {
    const user = await User.findById(req.params.userId).populate('profile');
    if (!user) return res.status(404).json({ msg: 'User not found' });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: user.profile
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
    console.error(err);
  }
};

module.exports.updateProfile = async (req, res) => {
  
  try {
    const user = await User.findById(req.params.userId);
    const updates = req.body;
    // Split user fields and profile fields
    const userFields = {};
    if (updates.name) userFields.name = updates.name;
    if (updates.email) userFields.email = updates.email;

    // Remove user fields from updates for profile
    const profileFields = { ...updates };
    delete profileFields.name;
    delete profileFields.email;
 console.log('Profile Fields:', profileFields);
    // Update user fields
    if (Object.keys(userFields).length > 0) {
      await User.findByIdAndUpdate(user._id, userFields);
    }

    let ProfileModel = user.role === 'entrepreneur' ? Entrepreneur : Investor;
    let profile = await ProfileModel.findOne({ user: user._id });

    if (!profile) {
      profile = await ProfileModel.create({ ...profileFields, user: user._id });
      user.profile = profile._id;
      await user.save();
    } else {
      profile = await ProfileModel.findOneAndUpdate(
        { user: user._id },
        profileFields,
        { new: true }
      );
    }

    res.json({ msg: 'Profile saved', profile });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

module.exports.getAllEntrepreneurs = async (req, res) => {
   
  try {
    const entrepreneurs = await Entrepreneur.find().populate('user', 'name email');
    
    res.json(entrepreneurs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error 78' });
  }
};
module.exports.getAllInvestors = async (req, res) => {
    
  try {
    const investors = await Investor.find().populate('user', 'name email');
  
    res.json(investors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server Error 88' });
  }
};
