
const mongoose = require('mongoose');

const investorProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bio: String,
  investmentInterests: [String],
  portfolioCompanies: [String],
  avatar:{
    type: String,
    default: '/public/images/investor-default.jpg'
  }
});

module.exports = mongoose.model('investor', investorProfileSchema);
