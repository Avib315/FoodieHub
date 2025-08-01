const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  targetType: {
    type: String,
    enum: ['recipe', 'comment', 'user'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  reason: {
    type: String,
    required: true,
    enum: ['inappropriate_content', 'spam', 'harassment', 'copyright', 'other']
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
    default: 'pending'
  },
  adminResponse: {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    action: {
      type: String,
      enum: ['no_action', 'warning', 'content_removed', 'user_blocked']
    },
    notes: String,
    reviewedAt: Date
  }
}, {
  timestamps: true
});
const reportModel = mongoose.model('Report', reportSchema);
module.exports = reportModel;