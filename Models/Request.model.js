const mongoose = require('mongoose');

const collabRequestSchema = new mongoose.Schema({
  investorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'investor',
    required: true
  },
  entrepreneurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'entrepreneur',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('CollabRequest', collabRequestSchema);
