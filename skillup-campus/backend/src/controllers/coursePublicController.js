const Course = require('../models/courses');

exports.getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.findAll();
        if (!courses || courses.length === 0) {
            return res.status(404).json({ error: 'No se encontraron cursos' });
        }
        res.status(200).json(courses);
    } 
    catch (err) {
        next(err);
    }
}

exports.getCourseById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const courseById = await Course.findByPk(id);
        if (!courseById) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        res.status(200).json(courseById);
    } 
    catch (err) {
        next(err);
    }
}
