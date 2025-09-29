const ResponseHandler = require("../lib/responseHanlder");

const adminMiddleware = (req, res, next) => {
    try {
        if (!req.user || !req.user.esAdmin) {
            return ResponseHandler.sendForbidden(res, 'Se requieren permisos de administrador');
        }
        next();
    } catch (error) {
        ResponseHandler.sendForbidden(res, 'Error al verificar permisos');
    }
};

module.exports = adminMiddleware;