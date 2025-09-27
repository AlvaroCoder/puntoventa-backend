const { Op } = require('sequelize');
const UsuarioModelo = require('../../models/core/usuarios');
const ResponseHandler = require('../../lib/responseHanlder');
const bcrypt = require('bcrypt');
exports.getAllUsuarios=async(req, res)=>{
    try {
        const { activo, email, nombre } = req.query;
    
        let whereClause = {};
        
        if (activo !== undefined) {
          whereClause.activo = activo === 'true';
        }
        
        if (email) {
          whereClause.email = { [Op.like]: `%${email}%` };
        }
        
        if (nombre) {
          whereClause.nombre_completo = { [Op.like]: `%${nombre}%` };
        }
        const usuarios = await UsuarioModelo.findAll({
            where: whereClause,
            attributes: { exclude: ['password_hash'] },
            order: [['nombre_completo', 'ASC']]
          });
          
        ResponseHandler.sendSuccess(res, "Usuarios obtenidos exitosamente", {
            data: usuarios,
            count: usuarios.length
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err ))
    }
}

exports.getUsuarioById=async(req,res)=>{
    try {
        const usuario = await UsuarioModelo.findByPk(req.params.id,{
            attributes : {exclude : ['password_hash']}
        });

        if (!usuario) {
            return ResponseHandler.sendNotFound(res, "Usuario no encontrado");
        }

        ResponseHandler.sendSuccess(res, "Usuario encontrado", usuario);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.getUsuarioActual=async(req, res)=>{
    try {
        const usuario = await UsuarioModelo.findByPk(req.user.id,{
            attributes : { exclude : ['password_hash'] }
        });
        if (!usuario) {
            return ResponseHandler.sendNotFound(res, "Usuario no encontrado");
        }
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.createUsuario=async(req, res)=>{
    try {
        const {password, ...userData} = req.body;
        if (!password) {
            return ResponseHandler.sendNotFound(res, "No existe contraseña");
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        const usuario = await UsuarioModelo.create({
            ...userData,
            password_hash: passwordHash
        });

        const usuarioResponse = { ...usuario.toJSON() };
        delete usuarioResponse.password_hash;

        ResponseHandler.sendCreated(res, "Usuario creado exitosamente", usuarioResponse);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.updateUsuario=async(req, res)=>{
    try {
        const usuario = await UsuarioModelo.findByPk(req.params.id);
    
        if (!usuario) {
          return ResponseHandler.sendNotFound(res, 'Usuario no encontrado');
        }

        const { password, ...userData } = req.body;

        if (password) {
            const saltRounds = 10;
            userData.password_hash = await bcrypt.hash(password, saltRounds);
        }

        await usuario.update(userData);
        const usuarioResponse = { ...usuario.toJSON() };
        delete usuarioResponse.password_hash;
        
        ResponseHandler.sendSuccess(res, "Usuario actualizado exitosamente", usuarioResponse);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.updatePerfil=async(req,res)=>{
    try {
        const usuario = await UsuarioModelo.findByPk(req.user.id);
    
        if (!usuario) {
          return ResponseHandler.sendNotFound(res, 'Usuario no encontrado');
        }
        
        const { password, ...userData } = req.body;

        delete userData.activo;
        delete userData.fecha_registro;

        if (password) {
            const saltRounds = 10;
            userData.password_hash = await bcrypt.hash(password, saltRounds);
        }
          
        await usuario.update(userData);

        const usuarioResponse = { ...usuario.toJSON() };
        delete usuarioResponse.password_hash;
        
        ResponseHandler.sendSuccess(res, "Perfil actualizado exitosamente", usuarioResponse);
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err))
    }
}

exports.deleteUsuario=async(req,res)=>{
    try {
        const usuario = await UsuarioModelo.findByPk(req.params.id);
    
        if (!usuario) {
          return ResponseHandler.sendNotFound(res, 'Usuario no encontrado');
        }
        if (req.user.id === usuario.id) {
            return ResponseHandler.sendForbidden(res, "No puedes eliminar tu propio usuario");
        }
        await usuario.destroy();

        ResponseHandler.sendSuccess(res, "Usuario eliminado correctamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.toggleEstadoUsuario=async(req,res)=>{
    try {
        const { activo } = req.body;
        const usuario = await UsuarioModelo.findByPk(req.params.id);

        if (!usuario) {
            return ResponseHandler.sendNotFound(res, 'Usuario no encontrado');
        };

        if (req.user.id === usuario.id && !activo) {
            return ResponseHandler.sendForbidden(res, "No puedes desactivar tu propio usuario");
        }
        
        await usuario.update({ activo });
    
        const mensaje = activo ? "Usuario activado exitosamente" : "Usuario desactivado exitosamente";
        ResponseHandler.sendSuccess(res, mensaje, {
            id: usuario.id,
            activo: usuario.activo
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.actualizarUltimoLogin=async(req, res)=>{
    try {
        const usuario = await UsuarioModelo.findByPk(req.params.id);

        if (!usuario) {
            return ResponseHandler.sendNotFound(res, 'Usuario no encontrado');
        }

        await usuario.update({ ultimo_login: new Date() });

        ResponseHandler.sendSuccess(res, "Último login actualizado", {
            id: usuario.id,
            ultimo_login: usuario.ultimo_login
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.cambiarPassword=async(req,res)=>{
    try {
        const { password_actual, nueva_password } = req.body;
        const usuario = await UsuarioModelo.findByPk(req.params.id);
        
        if (!usuario) {
          return ResponseHandler.sendNotFound(res, 'Usuario no encontrado');
        }

        const passwordValida = await bcrypt.compare(password_actual, usuario.password_hash);
        if (!passwordValida) {
          return ResponseHandler.sendUnAuthorized(res, "Contraseña actual incorrecta");
        }

        const saltRounds = 10;
        const nuevaPasswordHash = await bcrypt.hash(nueva_password, saltRounds);
        
        await usuario.update({ password_hash: nuevaPasswordHash });
        
        ResponseHandler.sendSuccess(res, "Contraseña cambiada exitosamente");
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.searchUsuario=async(req, res)=>{
    try {
        const { termino } = req.params;
        const { activo } = req.query;
        
        let whereClause = {
          [Op.or]: [
            { email: { [Op.like]: `%${termino}%` } },
            { nombre_completo: { [Op.like]: `%${termino}%` } },
            { ruc_dni: { [Op.like]: `%${termino}%` } }
          ]
        };

        if (activo !== undefined) {
            whereClause.activo = activo === 'true';
        }
          
        const usuarios = await UsuarioModelo.findAll({
            where: whereClause,
            attributes: { exclude: ['password_hash'] },
            order: [['nombre_completo', 'ASC']]
        });

        ResponseHandler.sendSuccess(res, "Búsqueda de usuarios completada", {
            data: usuarios,
            count: usuarios.length
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));   
    }
};

exports.verificarEmail=async(req, res)=>{
    try {
        const { email } = req.params;
        const { exclude_id } = req.query;
        
        let whereClause = { email: email.toLowerCase() };
        
        if (exclude_id) {
          whereClause.id = { [Op.ne]: exclude_id };
        }
        
        const usuarioExistente = await UsuarioModelo.findOne({ where: whereClause });

        ResponseHandler.sendSuccess(res, "Verificación de email completada", {
            disponible: !usuarioExistente,
            email: email.toLowerCase()
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}

exports.verificarDocumento=async(req,res)=>{
    try {
        const { documento } = req.params;
        const { exclude_id } = req.query;
        
        let whereClause = { ruc_dni: documento };
        
        if (exclude_id) {
          whereClause.id = { [Op.ne]: exclude_id };
        }
        
        const usuarioExistente = await Usuario.findOne({ where: whereClause });
        
        ResponseHandler.sendSuccess(res, "Verificación de documento completada", {
          disponible: !usuarioExistente,
          documento: documento
        });
    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}
