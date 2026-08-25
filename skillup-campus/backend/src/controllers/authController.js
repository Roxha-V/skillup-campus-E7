const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res, next) => {
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
    next(err);
  }
 };

 exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', id: user.id, role: user.role, token });

  } 
  catch (err) {
    next(err);
  }
 };


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
