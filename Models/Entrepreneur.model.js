// models/EntrepreneurProfile.js
const mongoose = require('mongoose');

const entrepreneurProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bio: String,
  startupName: String,
  startupDescription: String,
  fundingNeed: Number,
  pitchDeckLink: String,
    businessImage: {
        type: String,
        default: '/public/images/charles-forerunner-3fPXt37X6UQ-unsplash.jpg'
    },
    entrepreneurImage:{
        type: String,
        default: '/public/images/bernd-dittrich-pYlBAu3de0w-unsplash.jpg'
    }
});

module.exports = mongoose.model('entrepreneur', entrepreneurProfileSchema);
