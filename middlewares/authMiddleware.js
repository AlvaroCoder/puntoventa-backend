const jwt = require('jsonwebtoken');
const ResponseHandler = require('../lib/responseHanlder');

const authMiddleware = (req, res, next) => {
    try {
        // Si no envia el JWT con authorization entonces no permite el acceso a la ruta.
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return ResponseHandler.sendUnAuthorized(res, 'Token de acceso requerido');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded;
        next();
    } catch (error) {
        ResponseHandler.sendUnAuthorized(res, 'Token inválido');
    }
};

module.exports = authMiddleware;