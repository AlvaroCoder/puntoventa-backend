const Usuario = require('../models/usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
// Solo se puede crear usuarios
exports.createUsuario = async (req,res) =>{

    const {nombre_usuario, contrasenna} =req.body;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(contrasenna, salt);
        
        const nuevoUsuario = await Usuario.create({
            nombre_usuario,
            contrasena : hash
        });
        res.status(201).json(nuevoUsuario);

    } catch (err) {
        res.status(500).json({message : 'Error al crear el usuario', error : err})
    }
}
// Funcion de loggearse con el usuario
exports.loginUsuario = async(req, res)=>{
    const {username , password} = req.body;
    try {
        const usuario = await Usuario.findOne({
            where : {
                nombre_usuario : username
            }
        })
        if (!usuario) {
            return res.status(404).json({message : 'Usuario no encontrado'})
        }
        const jsonUsuario = usuario.toJSON()
        const contrasenaCorrecta = await bcrypt.compare( password, jsonUsuario?.contrasena);
        if (!contrasenaCorrecta) {
            return res.status(404).json({message : "Contraseña incorrecta"})
        }
        // Generamos el token
        const token = jwt.sign({userId : jsonUsuario?.id, role : jsonUsuario?.role }, JWT_SECRET, {expiresIn : '1d'} )
        return res.status(200).json({message : "Iniciaste sesion correctamente", access_token : token})
        
    } catch (err) {        
        res.status(500).json({message : 'Error al iniciar session', error : err})
    }
}