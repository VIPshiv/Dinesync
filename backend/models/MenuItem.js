const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['appetizers','starters','mains','desserts','beverages'] 
  },
  subcategory: { type: String, trim: true },
  image: { type: String, trim: true },
  ingredients: [{ type: String, trim: true }],
  spiceLevel: { type: String, enum: ['mild','medium','hot'], default: 'mild' },
  dietary: [{ type: String, trim: true }], // e.g., vegetarian, vegan, gluten-free
  preparationTime: { type: String, trim: true },
  reviews: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, trim: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

menuItemSchema.methods.toClient = function() {
  return {
    id: this._id.toString(),
    name: this.name,
    price: this.price,
    description: this.description,
    category: this.category,
    subcategory: this.subcategory,
    image: this.image,
    ingredients: this.ingredients,
    spiceLevel: this.spiceLevel,
    dietary: this.dietary,
    preparationTime: this.preparationTime,
    reviews: this.reviews,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('MenuItem', menuItemSchema);