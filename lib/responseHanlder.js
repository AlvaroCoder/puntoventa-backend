class ResponseHandler{
    static success(message="Exito", data=null, statusCode=200){
        return {
            error : false,
            status : statusCode,
            message,
            data,
            timestamp: new Date().toISOString()
        }
    }

    static created(message="Se creo con exito", data=null){
        this.success(message, data, 201);
    }

    static accepted(message="Se acepto con exito", data=null){
        this.success(message, data, 202);
    }
    
    static noContent(message="Sin contenido"){
        this.success(message, null, 204);
    }

    static badRequest(message="Solicitud incorrecta", errors=null){
        return {
            error : true,
            status : 404,
            message,
            errors,
            timestamp : new Date().toISOString()
        }
    }

    static unauthorized(message="No autorizado"){
        return {
            error : true,
            status : 401,
            message,
            timestamp : new Date().toISOString()
        }
    }
    static forbidden(message = "Acceso prohibido") {
        return {
            status: 403,
            error: true,
            message,
            timestamp: new Date().toISOString()
        };
    }
    
    static notFound(message = "Recurso no encontrado") {
        return {
            status: 404,
            error: true,
            message,
            timestamp: new Date().toISOString()
        };
    }
    static conflict(message = "Conflicto con el estado actual del recurso") {
        return {
            status: 409,
            error: true,
            message,
            timestamp: new Date().toISOString()
        };
    }
    
    static validationError(message = "Error de validación", errors = null) {
        return {
            status: 422,
            error: true,
            message,
            errors,
            timestamp: new Date().toISOString()
        };
    }
    static internalError(message = "Error interno del servidor", errorDetails = null) {
        return {
            status: 500,
            error: true,
            message,
            errorDetails: process.env.NODE_ENV === 'development' ? errorDetails : undefined,
            timestamp: new Date().toISOString()
        };
    }
    static notImplemented(message = "Funcionalidad no implementada") {
        return {
            status: 501,
            error: true,
            message,
            timestamp: new Date().toISOString()
        };
    }

    static serviceUnavailable(message = "Servicio no disponible temporalmente") {
        return {
            status: 503,
            error: true,
            message,
            timestamp: new Date().toISOString()
        };
    }
    static handlerSequelizeError(error){
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => ({
              field: err.path,
              message: err.message,
              value: err.value
            }));
            return this.validationError("Error de validación en los datos", errors);
        }

        if (error.name === 'SequelizeUniqueConstraintError') {
            return this.conflict("El recurso ya existe o viola una restricción única");
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return this.badRequest("Error de referencia: el recurso relacionado no existe");
        }
  
        if (error.name === 'SequelizeDatabaseError') {
            return this.internalError("Error de base de datos", process.env.NODE_ENV === 'development' ? error.message : undefined);
        }
        return this.internalError("Error inesperado", process.env.NODE_ENV === 'development' ? error.message : undefined);
    }
    static send(res, responseObject) {
        return res.status(responseObject.status).json(responseObject);
    }
    static sendSuccess(res, message = "Éxito", data = null, statusCode = 200) {
        return res.status(statusCode).json(this.success(message, data, statusCode));
    }
    static sendCreated(res, message = "Recurso creado exitosamente", data = null) {
        return res.status(201).json(this.created(message, data));
    }
    
    static sendNotFound(res, message = "Recurso no encontrado") {
        return res.status(404).json(this.notFound(message));
    }
    static sendValidationError(res, message = "Error de validación", errors = null) {
        return res.status(422).json(this.validationError(message, errors));
    }
    static sendForbidden(res, message="Acceso no permitido"){
        return res.status(403).json(this.forbidden(message));
    }
    static sendUnAuthorized(res, message="Acceso denegado"){
        return res.status(401).json(this.unauthorized(message));
    }
    static sendInternalError(res, message = "Error interno del servidor", errorDetails = null) {
        return res.status(500).json(this.internalError(message, errorDetails));
    }
}

module.exports = ResponseHandler;