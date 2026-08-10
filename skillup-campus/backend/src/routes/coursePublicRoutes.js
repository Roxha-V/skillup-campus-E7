const express = require('express');
const router = express.Router();
const courseController = require('../controllers/coursePublicController');

// Rutas para obtener cursos
router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);

module.exports = router;