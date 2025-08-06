const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'user_blocked', 'user_unblocked', 'user_deleted',
      'recipe_approved', 'recipe_rejected', 'recipe_deleted',
      'comment_added', 'comment_deleted',
      'settings_updated'
    ]
  },
  targetType: {
    type: String,
    enum: ['user', 'recipe', 'comment', 'system'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed // אובייקט גמיש לפרטים נוספים
  },
}, {
  timestamps: true
});
const adminLogModel = mongoose.model('AdminLog', adminLogSchema);
module.exports = adminLogModel;
