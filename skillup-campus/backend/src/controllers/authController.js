const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const isUserExist = await User.findOne({ where: { email } });
    if (isUserExist) {
      return res.status(400).json({ error: 'Ya hay un usuario registrado con ese email' });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash, name, role: 'student' });
    res.status(201).json({ message: 'Usuario creado', id: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
 };