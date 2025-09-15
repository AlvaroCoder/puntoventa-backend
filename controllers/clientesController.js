const { Op } = require('sequelize');
const Cliente = require('../models/cliente');

exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: err });
  }
};

exports.getDataSunatCliente=async(req, res)=>{
  try {
    const {documento} = req.query;

    const URL_DNI = process.env.URL_DNI;
    const TOKEN_DNI = process.env.TOKEN_API_DNI_SUNAT;

    const URI = URL_DNI + documento + "?token=" + TOKEN_DNI;
    const userSunat = await fetch(URI, {method : 'GET'});
    const jsonUser = await userSunat.json();
    if (!jsonUser?.success) {
      res.status(404).send({message : "No se encontraron resultados"});
      return;
    }
    const dataResponse = {
      dni : documento,
      nombre : jsonUser.nombres,
      apellido : jsonUser.apellidoPaterno + " "+jsonUser.apellidoMaterno
  }
  
  res.json(dataResponse);
  } catch (err) {
    res.status(500).json({message  : 'Hubo un error en el servidor de SUNAT'})
  }
}

exports.createCliente = async (req, res) => {
  const { 
    nombre_cliente, 
    apellido_cliente, 
    dni_cliente, 
    telefono_cliente, 
    deuda_actual, 
    fecha_ultimo_pago, 
    puntuacion,
    isactive = 0
  } = req.body;
  
  try {
    const clienteExistente = await Cliente.findOne({
      where : {
        [Op.or] : [
          {dni_cliente},
          {nombre_cliente},
          {apellido_cliente}
        ]
      }
    });
    if (clienteExistente) {
      return res.status(400).json({ message: 'Ya existe un cliente con el mismo DNI, nombre o apellido.' });
    };

    await Cliente.create({ 
      nombre_cliente, 
      apellido_cliente, 
      dni_cliente, 
      deuda_actual, 
      telefono_cliente,
      isactive,
      fecha_ultimo_pago, 
      puntuacion 
    });
    
    res.status(201).json({message : "Se creo con exito el nuevo cliente"});
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el cliente', error: err });
  }
};

exports.deleteCliente = async (req,res)=>{
  const {id_cliente} = req.query;
  try {
    const cliente = await Cliente.destroy({
      where: {
        id_cliente: id_cliente
      }
    });

    if (cliente) {
      res.status(200).json({ message: 'Cliente eliminado exitosamente' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: err });
  }
}
exports.updateCliente = async(req,res)=>{
  const {id_cliente} =  req.query;
  try {
    const cliente = await Cliente.update({
      nombre_cliente: req.body.nombre_cliente,
      apellido_cliente: req.body.apellido_cliente,
      dni_cliente: req.body.dni_cliente,
      deuda_actual: req.body.deuda_actual,
      telefono_cliente: req.body.telefono_cliente,
      fecha_ultimo_pago: req.body.fecha_ultimo_pago,
      puntuacion: req.body.puntuacion,
      isactive: req.body.isactive
    }, {
      where: {
        id_cliente: id_cliente
      }
    });
    if (cliente[0] === 1) {
      res.status(200).json({ message: 'Cliente actualizado exitosamente' });
    } else {
      res.status(404).json({ message: 'Cliente no encontrado o no se realizaron cambios' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: err });
  }
}
exports.getCreditCliente=async(req,res)=>{
  try {
    const {idCliente} = req?.query;
    
  } catch (err) {
    
  }
}