const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseAdminController');

// Rutas para modificar cursos
router.post('/create', courseController.createCourse);
router.put('/:id/:field/:value', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
