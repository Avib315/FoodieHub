const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  alternativeNames: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['פירות וירקות',
         'בשר ודגים',
          'חלב וביצים',
           'דגנים וקטניות',
            'תבלינים',
             'שמנים',
             'מוצרי מאפייה',
             'שונות']
  },
  defaultUnit: {
    type: String,
    required: true,
    enum: ['גרם', 'קילוגרם', 'מ"ל', 'ליטר', 'כף', 'כפית', 'כוס', 'יחידה']
  },
  isGlobal: {
    type: Boolean,
    default: true // מוצר גלובלי או אישי
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // אם null זה מוצר גלובלי
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
const productModel = mongoose.model('Product', productSchema);
module.exports = productModel;