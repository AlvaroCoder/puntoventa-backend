const Worker = require('../models/worker');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.iniciarSesion=async(req,res)=>{
    try {
        const {
            username,
            password
        } = req.body;

        const usuario = await Worker.findOne({
            where : {
                dni : username
            }
        });
        if (!usuario) {
            return res.status(404).json({message : "Trabajador no encontrado"});
        }
        const jsonUsuario = usuario.toJSON();
        const contrasennaCorrecta = await bcrypt.compare(password, jsonUsuario?.contrasenna_hash);
        if (!contrasennaCorrecta) {
            return res.status(404).json({message : "Contraseña incorrecta"});
        }
        const token = jwt.sign({userId : jsonUsuario.id_trabajador, role : 'trabajador'}, JWT_SECRET, {expiresIn : '1d'})
        return res.status(200).json({message : "Iniciaste sesion", access_token : token})
    } catch (err) {
        
    }
}

exports.getAllWorkers = async(req, res)=>{
    try {
        const trabajadores = await Worker.findAll();
        res.json(trabajadores);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: err });
    }
};

exports.getWorkerDataById = async(req, res)=>{
    try {
        const {idTrabajador} = req.params;
        const trabajador = await Worker.findByPk(idTrabajador);
        if (!trabajador) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
          }
        res.json(trabajador);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener los clientes', error: err });
    }
}

exports.updateWorker = async (req, res) => {
    try {
      const { idTrabajador } = req.params;
      const { nombre, apellido, puesto, estado, fecha_ingreso, fecha_salida } = req.body;
  
      const trabajador = await Worker.findByPk(idTrabajador);
      if (!trabajador) {
        return res.status(404).json({ message: "Trabajador no encontrado" });
      }
  
      await trabajador.update({
        nombre,
        apellido,
        puesto,
        estado,
        fecha_ingreso,
        fecha_salida,
      });
  
      res.json({ message: "Trabajador actualizado con éxito" });
    } catch (err) {
      res.status(500).json({ message: "Error al actualizar el trabajador", error: err });
    }
};
exports.deleteWorker = async (req, res) => {
    try {
        const { idTrabajador } = req.params;
        const trabajador = await Worker.findByPk(idTrabajador);
    
        if (!trabajador) {
        return res.status(404).json({ message: "Trabajador no encontrado" });
        }
  
        await trabajador.update({ estado: "despedido" });
  
        res.json({ message: "Trabajador marcado como despedido" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar el trabajador", error: err });
    }
  };


exports.createWorker=async(req, res)=>{
    try {
        const {
            id_tienda,
            nombre, 
            apellido,
            dni,
            puesto, 
            estado,
            fecha_ingreso,
            fecha_salida,
            contrasenna
        } = req.body;
        const salt = await bcrypt.genSalt(10);
        const contrasenna_hash = await bcrypt.hash(contrasenna, salt);
        await Worker.create({
            id_tienda,
            nombre,
            apellido,
            dni,
            puesto, 
            estado,
            fecha_ingreso,
            fecha_salida,
            contrasenna_hash
        });
        res.status(201).json({message : "Se creo con exito el nuevo trabajador"});

    } catch (err) {
        res.status(500).json({ message: 'Error al crear el trabajador', error: err });
    }
}

exports.getWorkerByEstado=async(req, res)=>{
    try {
        const { estado } = req.query;
        const where = estado ? { estado } : {};
        const trabajadores = await Worker.findAll({ where });
        res.json(trabajadores)
    } catch (err) { 
        res.status(500).json({ message: "Error al obtener trabajadores", error: err });
    }
}