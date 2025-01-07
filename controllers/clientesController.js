const Cliente = require('../models/cliente');

// Obtener todos los clientes
exports.getAllClientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: err });
  }
};

// Crear un cliente
exports.createCliente = async (req, res) => {
  const { nombre_cliente, apellido_cliente, dni_cliente, deuda_actual, fecha_ultimo_pago, puntuacion } = req.body;
  
  try {
    const nuevoCliente = await Cliente.create({ 
      nombre_cliente, 
      apellido_cliente, 
      dni_cliente, 
      deuda_actual, 
      fecha_ultimo_pago, 
      puntuacion 
    });
    res.status(201).json(nuevoCliente);
  } catch (err) {
    res.status(500).json({ message: 'Error al crear el cliente', error: err });
  }
};
// Eliminar un cliente
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
// Actualizar un cliente
exports.updateCliente = async(req,res)=>{
  const {id_cliente} =  req.query;
  try {
    const cliente = await Cliente.update({
      
    })
  } catch (err) {
    
  }
}