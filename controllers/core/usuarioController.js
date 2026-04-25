const { Op } = require('sequelize');
const UsuarioModelo = require('../../models/core/usuarios');
const EmpresaModelo = require('../../models/core/empresa');
const TrabajadorModelo = require('../../models/core/trabajador');
const RolModelo = require('../../models/core/rol');
const ResponseHandler = require('../../lib/responseHanlder');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const crearTransportador = () => nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_por_defecto_cambiar_en_produccion';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

// Token para el dueño de una empresa (esAdmin: true)
const generarTokenDueno = (usuario, empresaId) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, nombre_completo: usuario.nombre_completo, esAdmin: true, empresa_id: empresaId },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
};

// Token para un trabajador (esAdmin: false, con rol y nivel_permiso)
const generarTokenTrabajador = (usuario, trabajador, rol) => {
    return jwt.sign(
        {
            id: usuario.id, email: usuario.email, nombre_completo: usuario.nombre_completo,
            esAdmin: false, empresa_id: trabajador.empresa_id, tienda_id: trabajador.tienda_id,
            rol_id: trabajador.rol_id, nivel_permiso: rol.nivel_permiso
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
};

// Token temporal para registro (sin empresa aún)
const generarTokenRegistro = (usuario) => {
    return jwt.sign(
        { id: usuario.id, email: usuario.email, nombre_completo: usuario.nombre_completo, esAdmin: false },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
};

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
        
        ResponseHandler.sendSuccess(res, "Usuario actual", usuario);

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

        if (!usuarioExistente) {
            return ResponseHandler.sendNotFound(res, "No existe el usuario");
        }

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
        
        const usuarioExistente = await UsuarioModelo.findOne({ where: whereClause });
        
        if (!usuarioExistente) {
            return ResponseHandler.sendNotFound(res, "No existe ese usuario");
        }
        
        ResponseHandler.sendSuccess(res, "Verificación de documento completada", {
          disponible: Boolean(usuarioExistente),
          documento: documento
        });
    } catch (err) {        
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return ResponseHandler.sendValidationError(res, "Email y contraseña son requeridos");
        }

        const usuario = await UsuarioModelo.findOne({ where: { email: email.toLowerCase() } });
        if (!usuario) return ResponseHandler.sendUnAuthorized(res, "Credenciales inválidas");
        if (!usuario.activo) return ResponseHandler.sendForbidden(res, "El usuario no está activo");

        const contrasennaValida = await bcrypt.compare(password, usuario.password_hash);
        if (!contrasennaValida) return ResponseHandler.sendUnAuthorized(res, "Contraseña inválida");

        await usuario.update({ ultimo_login: new Date() });

        // Detectar si es dueño o trabajador
        let token;
        let tipoUsuario;
        let datosExtra = {};

        const empresa = await EmpresaModelo.findOne({ where: { usuario_id: usuario.id } });

        if (empresa) {
            token = generarTokenDueno(usuario, empresa.id);
            tipoUsuario = 'dueno';
            datosExtra = { empresa_id: empresa.id };
        } else {
            const trabajador = await TrabajadorModelo.findOne({ where: { usuario_id: usuario.id, activo: true } });

            if (!trabajador) {
                return ResponseHandler.sendForbidden(res,
                    "Tu cuenta no está asociada a ninguna empresa. Contacta al administrador."
                );
            }

            const rol = await RolModelo.findByPk(trabajador.rol_id);
            if (!rol) return ResponseHandler.sendForbidden(res, "El rol del trabajador no existe. Contacta al administrador.");

            token = generarTokenTrabajador(usuario, trabajador, rol);
            tipoUsuario = 'trabajador';
            datosExtra = {
                empresa_id: trabajador.empresa_id,
                tienda_id: trabajador.tienda_id,
                rol_id: trabajador.rol_id,
                nivel_permiso: rol.nivel_permiso,
                rol_nombre: rol.nombre
            };
        }

        ResponseHandler.sendSuccess(res, "Inicio de sesión exitoso", {
            usuario: {
                id: usuario.id, email: usuario.email,
                nombre_completo: usuario.nombre_completo,
                tipo: tipoUsuario,
                ...datosExtra
            },
            token,
            expira_en: JWT_EXPIRES
        });

    } catch (err) {
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
};

exports.loginGoogle=async(req, res)=>{
    try {
        const { credential } = req.body;

        if (!credential) {
            return ResponseHandler.sendValidationError(res, "Token de Google requerido");
        }

        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        const { email, name, sub: googleId } = payload;

        let usuario = await UsuarioModelo.findOne({ where: { email: email.toLowerCase() } });
        let isNewUser = false;

        if (!usuario) {
            usuario = await UsuarioModelo.create({
                email: email.toLowerCase(),
                nombre_completo: name ? name.trim().toUpperCase() : email,
                google_id: googleId,
                proveedor_auth: 'google',
                activo: true,
                fecha_registro: new Date()
            });
            isNewUser = true;
        } else if (!usuario.google_id) {
            await usuario.update({ google_id: googleId, proveedor_auth: 'google' });
        }

        if (!usuario.activo) {
            return ResponseHandler.sendForbidden(res, "El usuario no está activo");
        }

        await usuario.update({ ultimo_login: new Date() });

        const empresaGoogle = await EmpresaModelo.findOne({ where: { usuario_id: usuario.id } });
        const token = empresaGoogle
            ? generarTokenDueno(usuario, empresaGoogle.id)
            : generarTokenRegistro(usuario);

        ResponseHandler.sendSuccess(res, "Inicio de sesión con Google exitoso", {
            usuario: {
                id: usuario.id,
                email: usuario.email,
                nombre_completo: usuario.nombre_completo
            },
            token,
            isNewUser
        });
    } catch (err) {
        ResponseHandler.sendInternalError(res, "Error al verificar token de Google", err.message);
    }
};

exports.recuperarPassword=async(req, res)=>{
    try {
        const { email } = req.body;

        if (!email) {
            return ResponseHandler.sendValidationError(res, "Email requerido");
        }

        const usuario = await UsuarioModelo.findOne({ where: { email: email.toLowerCase() } });

        if (!usuario) {
            return ResponseHandler.sendSuccess(res, "Si el correo existe, recibirás un código");
        }

        const codigo = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 15 * 60 * 1000);

        await usuario.update({ reset_code: codigo, reset_code_expiry: expiry });

        const transporter = crearTransportador();
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: usuario.email,
            subject: 'Código de recuperación — PipoApp 360',
            html: `
                <div style="font-family:sans-serif;max-width:480px;margin:auto">
                    <h2 style="color:#1F4363">Recupera tu contraseña</h2>
                    <p>Tu código de verificación es:</p>
                    <div style="font-size:36px;font-weight:bold;letter-spacing:8px;color:#FF821E;padding:16px 0">${codigo}</div>
                    <p style="color:#666;font-size:13px">Este código expira en 15 minutos.</p>
                </div>
            `
        });

        ResponseHandler.sendSuccess(res, "Si el correo existe, recibirás un código");
    } catch (err) {
        ResponseHandler.sendInternalError(res, "Error al enviar código", err.message);
    }
};

exports.verificarCodigoReset=async(req, res)=>{
    try {
        const { email, codigo } = req.body;

        if (!email || !codigo) {
            return ResponseHandler.sendValidationError(res, "Email y código son requeridos");
        }

        const usuario = await UsuarioModelo.findOne({ where: { email: email.toLowerCase() } });

        if (!usuario || !usuario.reset_code || usuario.reset_code !== codigo) {
            return ResponseHandler.sendUnAuthorized(res, "Código inválido");
        }

        if (new Date() > new Date(usuario.reset_code_expiry)) {
            return ResponseHandler.sendUnAuthorized(res, "El código ha expirado");
        }

        const reset_token = jwt.sign(
            { email: usuario.email, tipo: 'reset' },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        ResponseHandler.sendSuccess(res, "Código verificado", { reset_token });
    } catch (err) {
        ResponseHandler.sendInternalError(res, "Error al verificar código", err.message);
    }
};

exports.resetPassword=async(req, res)=>{
    try {
        const { reset_token, nueva_password } = req.body;

        if (!reset_token || !nueva_password) {
            return ResponseHandler.sendValidationError(res, "Token y nueva contraseña son requeridos");
        }

        let payload;
        try {
            payload = jwt.verify(reset_token, process.env.JWT_SECRET);
        } catch {
            return ResponseHandler.sendUnAuthorized(res, "Token de reset inválido o expirado");
        }

        if (payload.tipo !== 'reset') {
            return ResponseHandler.sendUnAuthorized(res, "Token inválido");
        }

        const usuario = await UsuarioModelo.findOne({ where: { email: payload.email } });

        if (!usuario) {
            return ResponseHandler.sendNotFound(res, "Usuario no encontrado");
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(nueva_password, saltRounds);

        await usuario.update({
            password_hash: passwordHash,
            reset_code: null,
            reset_code_expiry: null
        });

        ResponseHandler.sendSuccess(res, "Contraseña actualizada exitosamente");
    } catch (err) {
        ResponseHandler.sendInternalError(res, "Error al resetear contraseña", err.message);
    }
};

exports.registro=async(req, res)=>{
    try {
        const { email, password, nombre_completo, ruc_dni, telefono } = req.body;

        if (!email || !password || !nombre_completo || !ruc_dni) {
            return ResponseHandler.sendValidationError(res, "Email, contraseña, nombre completo y RUC/DNI son requeridos");
        }

        const usuarioExistente = await UsuarioModelo.findOne({
            where : {email : email.toLowerCase()}
        });

        if (usuarioExistente) {
            return ResponseHandler.sendForbidden(res, "Usuario ya existente");
        }

        const documentoExistente = await UsuarioModelo.findOne({
            where: { ruc_dni: ruc_dni }
        });

        if (documentoExistente) {
            return ResponseHandler.sendForbidden(res, "El RUC/DNI ya está registrado");
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const usuario = await UsuarioModelo.create({
            email: email.toLowerCase(),
            password_hash: passwordHash,
            nombre_completo: nombre_completo.trim().toUpperCase(),
            ruc_dni: ruc_dni,
            telefono: telefono,
            activo: true,
            fecha_registro: new Date()
        });

        const token = generarTokenRegistro(usuario);

        const usuarioResponse = {
            id: usuario.id,
            email: usuario.email,
            nombre_completo: usuario.nombre_completo,
            ruc_dni: usuario.ruc_dni,
            telefono: usuario.telefono,
            fecha_registro: usuario.fecha_registro,
            activo: usuario.activo,
            ultimo_login: usuario.ultimo_login
        };

        ResponseHandler.sendSuccess(res, "Usuario registrado exitosamente", {
            usuario: usuarioResponse,
            token: token,
            expira_en: process.env.JWT_EXPIRES_IN || '24h'
        }, 201);

    } catch (err) {        
        ResponseHandler.send(res, ResponseHandler.handlerSequelizeError(err));
    }
}
