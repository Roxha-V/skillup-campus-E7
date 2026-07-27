const bcrypt = require('bcryptjs');
const User = require('../models/User');
exports.register = async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name, role });
    res.status(201).json({ message: 'Usuario creado', id: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
 };