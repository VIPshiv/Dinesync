const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const MenuItem = require('../models/MenuItem');
const Contact = require('../models/Contact');
const Order = require('../models/Order');
const User = require('../models/User');
const Subscriber = require('../models/Subscriber');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, phone, role } = req.body;
  try {
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      role: role || 'customer'
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to register user', details: err.message });
  }
});

// Login a user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    res.status(400).json({ error: 'Failed to login', details: err.message });
  }
});

// Get all menu items (with search, filter, and pagination)
router.get('/menu', async (req, res) => {
  const startTs = Date.now();
  try {
    const { name, maxPrice, category, page = 1, limit = 12 } = req.query;
    console.log('[GET /api/menu] query:', req.query);
    const query = {};
    if (name) query.name = { $regex: name, $options: 'i' };
    if (maxPrice) query.price = { $lte: parseFloat(maxPrice) };
    if (category && category !== 'all') query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const lim = parseInt(limit) > 500 ? 500 : parseInt(limit); // safety cap
    const [items, total] = await Promise.all([
      MenuItem.find(query).skip(skip).limit(lim),
      MenuItem.countDocuments(query)
    ]);
    const duration = Date.now() - startTs;
    console.log(`[GET /api/menu] success items=${items.length} total=${total} duration=${duration}ms`);
    res.json({
      items: items.map(i => i.toClient()),
      total,
      page: parseInt(page),
      pages: Math.ceil(total / lim)
    });
  } catch (err) {
    console.error('[GET /api/menu] ERROR:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Add a menu item
router.post('/menu', authMiddleware, adminMiddleware, async (req, res) => {
  const { name, price, description, category, subcategory, image, ingredients, spiceLevel, dietary, preparationTime } = req.body;
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(422).json({ error: 'Name required' });
    }
    if (typeof price !== 'number' || price < 0) {
      return res.status(422).json({ error: 'Price must be a non-negative number' });
    }
    if (!category || !['appetizers','starters','mains','desserts','beverages'].includes(category)) {
      return res.status(422).json({ error: 'Invalid category' });
    }
    const item = new MenuItem({
      name: name.trim(),
      price,
      description: description?.trim(),
      category,
      subcategory: subcategory?.trim(),
      image: image?.trim(),
      ingredients: Array.isArray(ingredients) ? ingredients : [],
      spiceLevel: spiceLevel || 'mild',
      dietary: Array.isArray(dietary) ? dietary : [],
      preparationTime: preparationTime?.trim()
    });
    await item.save();
    res.status(201).json({ item: item.toClient() });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add menu item', details: err.message });
  }
});

// Update a menu item
router.put('/menu/:id', authMiddleware, adminMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  try {
    if (name && (typeof name !== 'string' || name.trim() === '')) {
      return res.status(400).json({ error: 'Name must be a non-empty string' });
    }
    if (price && (typeof price !== 'number' || price <= 0)) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }
    if (description && typeof description !== 'string') {
      return res.status(400).json({ error: 'Description must be a string' });
    }
    const item = await MenuItem.findByIdAndUpdate(
      id,
      { name, price, description },
      { new: true, runValidators: true }
    );
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update menu item', details: err.message });
  }
});

// Delete a menu item
router.delete('/menu/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json({ message: 'Menu item deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete menu item', details: err.message });
  }
});

// Add a review to a menu item
router.post('/menu/:id/reviews', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
    }
    if (comment && typeof comment !== 'string') {
      return res.status(400).json({ error: 'Comment must be a string' });
    }
    const item = await MenuItem.findById(id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    item.reviews.push({ user: req.user.id, rating, comment });
    await item.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to add review', details: err.message });
  }
});

// Get reviews for a menu item
router.get('/menu/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findById(id).populate('reviews.user', 'email');
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    res.json(item.reviews);
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

// Submit contact form
router.post('/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(422).json({ error: 'Name must be a non-empty string' });
    }
    if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(422).json({ error: 'Email must be a valid address' });
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(422).json({ error: 'Message must be a non-empty string' });
    }
    if (message.length > 500) {
      return res.status(422).json({ error: 'Message exceeds 500 character limit' });
    }
    const allowedSubjects = ['reservation','feedback','catering','events','general','complaint'];
    const normalizedSubject = allowedSubjects.includes(subject) ? subject : 'general';
    const contact = new Contact({ name: name.trim(), email: email.trim(), subject: normalizedSubject, message: message.trim() });
    await contact.save();
    res.status(201).json({ message: 'Message received', contact: contact.toClient() });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save contact', details: err.message });
  }
});

// Place an order (public endpoint for now; could require auth later)
router.post('/orders', async (req, res) => {
  if (require('mongoose').connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not ready', details: 'Mongo connection not established' });
  }
  const { items, customerName, email, phone, deliveryAddress } = req.body;
  try {
  console.log('[POST /orders] raw body:', req.body);
    if (!customerName || !email) {
      return res.status(400).json({ error: 'customerName and email are required' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items must be a non-empty array' });
    }
    const normalizedItems = items.map(it => ({
      name: it.name,
      price: Number(it.price),
      quantity: Number(it.quantity)
    })).filter(it => it.name && !isNaN(it.price) && !isNaN(it.quantity) && it.quantity > 0);
    if (normalizedItems.length === 0) {
      return res.status(400).json({ error: 'Items array invalid after normalization' });
    }
    const calcTotal = normalizedItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  console.log('[POST /orders] normalizedItems:', normalizedItems, 'calcTotal:', calcTotal);
    const order = new Order({
      items: normalizedItems,
      customerName,
      email,
      phone,
      deliveryAddress,
      total: Number(calcTotal.toFixed(2)),
      estimatedTime: '20-30 minutes',
      status: 'Received',
      currentStep: 1
    });
    await order.save();
  console.log('[POST /orders] saved orderNumber:', order.orderNumber, 'total:', order.total);
    res.status(201).json({ message: 'Order placed successfully', order: order.toClient() });
  } catch (err) {
    res.status(400).json({ error: 'Failed to place order', details: err.message });
  }
});

// Get all orders (with pagination) - admin only
router.get('/orders', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
  const orders = await Order.find().skip(skip).limit(limit);
    const total = await Order.countDocuments();
    res.json({
  orders: orders.map(o => o.toClient()),
      total,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Update order status + currentStep progression (admin)
router.put('/orders/:orderNumber', authMiddleware, adminMiddleware, async (req, res) => {
  const { orderNumber } = req.params;
  const { status, currentStep, estimatedTime } = req.body;
  try {
    const allowedStatuses = ['Received', 'Preparing', 'Ready', 'Out for Delivery', 'Delivered'];
    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }
    const update = {};
    if (status) update.status = status;
    if (currentStep) update.currentStep = currentStep;
    if (estimatedTime) update.estimatedTime = estimatedTime;
    const order = await Order.findOneAndUpdate(
      { orderNumber },
      update,
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order status updated', order: order.toClient() });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order status', details: err.message });
  }
});

// Public: Track a single order by orderNumber + email (for security ensure both)
router.get('/orders/track/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email query parameter required' });
  try {
    const order = await Order.findOne({ orderNumber, email });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order: order.toClient() });
  } catch (err) {
    res.status(400).json({ error: 'Failed to fetch order', details: err.message });
  }
});

module.exports = router;
// Development helper (remove in production): seed minimal menu if empty
router.post('/menu/seed-dev-only', async (req, res) => {
  try {
    const count = await MenuItem.countDocuments();
    if (count > 0) return res.json({ message: 'Menu already seeded', count });
    const sample = [
      { name: 'Bruschetta', price: 6.5, description: 'Grilled bread, tomatoes, basil, olive oil', category: 'appetizers', image: '', dietary: ['vegetarian'], preparationTime: '10m' },
      { name: 'Margherita Pizza', price: 12, description: 'Classic pizza with tomato, mozzarella, basil', category: 'mains', image: '', dietary: ['vegetarian'], preparationTime: '18m' },
      { name: 'Tiramisu', price: 7, description: 'Coffee-flavored Italian dessert', category: 'desserts', image: '', dietary: [], preparationTime: '0m' }
    ];
    const created = await MenuItem.insertMany(sample);
    res.status(201).json({ message: 'Seeded', count: created.length });
  } catch (e) {
    res.status(500).json({ error: 'Seed failed', details: e.message });
  }
});

// Newsletter subscribe (idempotent)
router.post('/subscribe', async (req, res) => {
  const { email } = req.body;
  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(422).json({ error: 'Valid email required' });
  }
  // Ensure DB ready
  const ready = require('mongoose').connection.readyState === 1;
  if (!ready) {
    return res.status(503).json({ error: 'Database not ready', details: 'Mongo connection not established' });
  }
  try {
    // Quick ping to verify socket health
    const admin = require('mongoose').connection.db.admin();
    try {
      await admin.ping();
    } catch(pingErr){
      console.error('[POST /api/subscribe] ping failed', pingErr);
    }
    const normEmail = email.toLowerCase().trim();
    console.log('[POST /api/subscribe] inbound', normEmail);
    let existing = await Subscriber.findOne({ email: normEmail });
    if (existing) {
      console.log('[POST /api/subscribe] already subscribed', normEmail);
      return res.json({ message: 'Already subscribed', subscriber: existing.toClient() });
    }
    const sub = new Subscriber({ email: normEmail, user: req.user?.id });
    await sub.save();
    console.log('[POST /api/subscribe] created id=', sub._id.toString());
    res.status(201).json({ message: 'Subscribed', subscriber: sub.toClient() });
  } catch (err) {
    console.error('[POST /api/subscribe] ERROR name=%s code=%s message=%s stack=%s', err.name, err.code || 'n/a', err.message, err.stack);
    const conn = require('mongoose').connection;
    res.status(500).json({
      error: 'Failed to subscribe',
      details: err.message,
      meta: {
        mongoReadyState: conn.readyState,
        host: conn.host,
        name: conn.name,
        models: Object.keys(conn.models)
      }
    });
  }
});

// Check subscription status by email (public)
router.get('/subscribe/check', async (req, res) => {
  const { email } = req.query;
  if (!email || typeof email !== 'string' || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(422).json({ error: 'Valid email required' });
  }
  const ready = require('mongoose').connection.readyState === 1;
  if (!ready) return res.status(503).json({ error: 'Database not ready' });
  try {
    const normEmail = email.toLowerCase().trim();
    const found = await Subscriber.findOne({ email: normEmail });
    if (found) return res.json({ subscribed: true, email: normEmail });
    return res.json({ subscribed: false, email: normEmail });
  } catch (err) {
    console.error('[GET /api/subscribe/check] ERROR', err);
    res.status(500).json({ error: 'Lookup failed', details: err.message });
  }
});