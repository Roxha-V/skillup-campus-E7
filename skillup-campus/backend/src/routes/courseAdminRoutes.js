const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseAdminController');
const { authenticate, isAdmin } = require('../middlewares/adminmiddle');

const adminAuth = [authenticate, isAdmin];

// Rutas para modificar cursos
router.post('/create', adminAuth, courseController.createCourse);
router.put('/:id/:field/:value', adminAuth, courseController.updateCourse);
router.delete('/:id', adminAuth, courseController.deleteCourse);

module.exports = router;
