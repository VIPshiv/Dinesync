const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  createdAt: { type: Date, default: Date.now }
});

subscriberSchema.methods.toClient = function () {
  return { id: this._id.toString(), email: this.email, user: this.user || null, createdAt: this.createdAt };
};

module.exports = mongoose.model('Subscriber', subscriberSchema);