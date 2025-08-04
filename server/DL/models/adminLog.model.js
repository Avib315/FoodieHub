const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_blocked', 'user_unblocked', 'user_deleted',
      'recipe_approved', 'recipe_rejected', 'recipe_deleted',
      'comment_deleted', 'comment_hidden',
      'category_created', 'category_updated', 'category_deleted',
      'product_created', 'product_updated', 'product_deleted',
      'settings_updated'
    ]
  },
  targetType: {
    type: String,
    enum: ['user', 'recipe', 'comment', 'category', 'product', 'system'],
    required: true
  },
  targetId: {
    type: mongoose.Schema.Types.ObjectId
  },
  details: {
    type: mongoose.Schema.Types.Mixed // אובייקט גמיש לפרטים נוספים
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});
const adminLogModel = mongoose.model('AdminLog', adminLogSchema);
module.exports = adminLogModel;
