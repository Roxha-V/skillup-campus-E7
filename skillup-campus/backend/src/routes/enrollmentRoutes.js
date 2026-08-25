const express = require("express");
const router = express.Router();
const enrollmentController = require("../controllers/enrollmentController");
const authMiddleware = require("../middlewares/authmiddle");

// Ruta para registrar un usuario en un curso
router.post("/", enrollmentController.register);

// Ruta para obtener los cursos del usuario autenticado
router.get("/me", authMiddleware, enrollmentController.getMyEnrollments);

module.exports = router;        