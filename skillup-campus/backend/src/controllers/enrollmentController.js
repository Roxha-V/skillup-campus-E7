const enrollment = require('../models/enrollment');
const Course = require('../models/courses');

exports.register = async (req, res, next) => {
    try {
        const { userId, courseId } = req.body;
        
        const existingEnrollment = await enrollment.findOne({ where: { userId, courseId } });
        if (existingEnrollment) {
            return res.status(400).json({ error: 'El usuario ya está registrado en este curso' });
        }

        const newEnrollment = await enrollment.create({ userId, courseId });
        res.status(201).json(newEnrollment);
    } catch (error) {
        next(error);
    }
};

exports.getMyEnrollments = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const myEnrollments = await enrollment.findAll({
            where: { userId },
            include: [{
                model: Course,
                attributes: ['id', 'category', 'name', 'professor', 'votes', 'image_path', 'description']
            }]
        });

        if (!myEnrollments || myEnrollments.length === 0) {
            return res.status(404).json({ error: 'No se encontraron cursos para el usuario autenticado' });
        }

        const courses = myEnrollments
            .map(item => item.Course)
            .filter(Boolean)
            .map(course => course.toJSON ? course.toJSON() : course);

        res.status(200).json(courses);
    } catch (error) {
        next(error);
    }
};