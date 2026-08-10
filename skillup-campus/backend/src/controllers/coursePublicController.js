const course = require('../models/courseModel');

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await course.findAll();
        if (!courses || courses.length === 0) {
            res.status(404).json({ error: 'No se encontraron cursos' });
        }
        res.status(200).json(courses);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getCourseById = async (req, res) => {
    try {
        const { id } = req.params;
        const courseById = await course.findByPk(id);
        if (!courseById) {
            res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.status(200).json(courseById);
    } 
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}
