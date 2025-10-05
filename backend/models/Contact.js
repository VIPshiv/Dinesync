const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },      // e.g., "John"
  email: { type: String, required: true, trim: true },     // e.g., "john@example.com"
  subject: {                                               // topic selected in UI (optional)
    type: String,
    enum: ['reservation','feedback','catering','events','general','complaint'],
    default: 'general'
  },
  message: { type: String, required: true, trim: true, maxlength: 500 },   // limited to 500 chars per UI counter
  createdAt: { type: Date, default: Date.now } // Timestamp
});

// Optional helper to shape API responses consistently
contactSchema.methods.toClient = function() {
  return {
    id: this._id.toString(),
    name: this.name,
    email: this.email,
    subject: this.subject,
    message: this.message,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Contact', contactSchema);