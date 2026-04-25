const ResponseHandler = require('../lib/responseHanlder');

/**
 * Middleware factory para control de acceso por nivel de permiso.
 *
 * Los dueños (esAdmin: true) tienen acceso total siempre.
 * Los trabajadores necesitan nivel_permiso >= minNivel.
 *
 * Niveles: Vendedor=1, Cajero=2, Almacenero=3, Supervisor=4
 *
 * Uso: router.post('/', authMiddleware, roleMiddleware(4), controller.create)
 */
const roleMiddleware = (minNivel) => {
    return (req, res, next) => {
        try {
            if (!req.user) return ResponseHandler.sendUnAuthorized(res, "No autenticado");
            if (req.user.esAdmin === true) return next();

            const nivelActual = req.user.nivel_permiso ?? 0;
            if (nivelActual >= minNivel) return next();

            return ResponseHandler.sendForbidden(res,
                `Acceso denegado. Se requiere nivel ${minNivel} o superior. Tu nivel actual es ${nivelActual}.`
            );
        } catch {
            return ResponseHandler.sendForbidden(res, 'Error al verificar permisos de rol');
        }
    };
};

module.exports = roleMiddleware;
