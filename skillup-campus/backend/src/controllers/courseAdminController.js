const Course = require('../models/courses');

exports.createCourse = async (req, res) => {
    try {
        const { category, name, professor ,description, image_path } = req.body;
        if (!category || !name || !professor || !description) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        const isCourseExist = await Course.findOne({ where: { name } });
        if (isCourseExist) {
            return res.status(400).json({ error: 'Ya hay un curso registrado con ese nombre' });
        }
        const votes = 0;
        const course = await Course.create({ category, name, professor, votes, description, image_path: 'ruta_mock' });
        res.status(201).json(course);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.updateCourse = async (req, res) => {
    try {
        const { id, field, value } = req.params;
        const courseToUpdate = await Course.findByPk(id);
        if (!courseToUpdate) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        const updatedCourse = await courseToUpdate.update(
            { [field]: value }, 
            { where : { id } });
        res.status(200).json(updatedCourse);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const courseToDelete = await Course.findByPk(id);
        if (!courseToDelete) {
            return res.status(404).json({ error: 'Curso no encontrado' });
        }
        await courseToDelete.destroy();
        res.status(200).json({ message: 'Curso eliminado' });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
}