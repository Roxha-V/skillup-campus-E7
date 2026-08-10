const jwt = require('jsonwebtoken');

// 1. Este middleware LEE el token y CREA req.user
exports.authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado: Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // 👈 ¡AQUÍ se crea req.user con los datos del JWT!
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user?.role === 'admin') {
        return next();
    } 
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });

};