const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true, index: true }, // e.g. ORD00123
  customerName: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String },
  deliveryAddress: { type: String },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ],
  total: { type: Number, min: 0 },
  status: { 
    type: String, 
    default: 'Received',
    enum: ['Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered']
  },
  currentStep: { type: Number, default: 1, min: 1, max: 5 },
  estimatedTime: { type: String }, // e.g. "15-20 minutes" or "Ready now"
  createdAt: { type: Date, default: Date.now }
});

// Auto-generate incremental-looking orderNumber (not guaranteed strictly sequential under heavy concurrency, but fine for demo)
orderSchema.pre('save', async function(next) {
  if (this.orderNumber) return next();
  try {
    // Count documents for simple incremental suffix
    const count = await mongoose.model('Order').countDocuments();
    const sequential = (count + 1).toString().padStart(3, '0');
    this.orderNumber = `ORD${sequential}`;
    next();
  } catch (err) {
    next(err);
  }
});

// Recalculate total if not provided or mismatch
orderSchema.pre('validate', function(next) {
  if (this.items && this.items.length) {
    const calcTotal = this.items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    if (!this.total || Math.abs(this.total - calcTotal) > 0.01) {
      this.total = Number(calcTotal.toFixed(2));
    }
  }
  next();
});

// Provide a lean representation aligning with frontend expectations (id instead of orderNumber)
orderSchema.method('toClient', function() {
  const obj = this.toObject({ versionKey: false });
  obj.id = obj.orderNumber; // map for frontend existing usage
  return obj;
});

module.exports = mongoose.model('Order', orderSchema);