const express = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authmiddle');

// Limitar el número de solicitudes para evitar ataques de fuerza bruta
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite máximo de 5 peticiones por IP dentro de los 15 minutos
  message: { 
    error: 'Demasiados intentos desde esta IP. Por favor, intenta de nuevo en 15 minutos.' 
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});

// Rutas de autenticación
router.post('/register', [
  // 1. Validaciones requeridas
  body('email')
    .isEmail().withMessage('El formato del correo electrónico no es válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('name')
    .notEmpty().withMessage('El nombre es requerido')
    .trim(),
  (req, res, next) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
      return res.status(400).json({ errores: errores.array() });
    }
    next(); 
  }
], authController.register);
router.post('/login', authLimiter, authController.login);

// Ruta protegida para obtener el perfil del usuario
router.get('/profile', authMiddleware);

// Ruta para listar usuarios
router.get('/admin/users', authMiddleware, authController.getAllUsers); 

module.exports = router;