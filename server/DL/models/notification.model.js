const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['comment_reply', 
        'recipe_rated',
        'recipe_approved',
        'recipe_rejected',
        'new_follower',
        'system'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId // מזהה הישות הקשורה (מתכון, תגובה וכו')
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isEmailSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
const notificationModel = mongoose.model('Notification', notificationSchema);
module.exports = notificationModel;
