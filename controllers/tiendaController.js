
const Tienda = require('../models/store');

exports.getAllTiendasByIdUsuario=async(req, res)=>{
    try {
        const {idUsuario} = req.query;
        const tiendas = await Tienda.findAll({where : {
            id_usuario : idUsuario
        }});
        res.json(tiendas);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las tiendas', error: err });
    }
};

exports.getTiendaByIdTienda=async(req, res)=>{
    try {
        const {idTienda } = req.query;
        const tienda =await Tienda.findByPk(idTienda);
        res.json(tienda);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener las tienda', error: err });

    }
}

exports.deleteTienda = async (req, res) => {
    try {
        const { idTienda } = req.params;
        const tienda = await Tienda.findByPk(idTienda);

        if (!tienda) {
            return res.status(404).json({ message: "Tienda no encontrada" });
        }

        await tienda.destroy();
        res.json({ message: "Tienda eliminada con éxito" });
    } catch (err) {
        res.status(500).json({ message: "Error al eliminar la tienda", error: err });
    }
};

exports.updateTienda = async (req, res) => {
    try {
        const { idTienda } = req.params;
        const { nombre, direccion, telefono, estado } = req.body;

        const tienda = await Tienda.findByPk(idTienda);
        if (!tienda) {
            return res.status(404).json({ message: "Tienda no encontrada" });
        }

        await tienda.update({ nombre, direccion, telefono, estado });
        res.json({ message: "Tienda actualizada con éxito", tienda });
    } catch (err) {
        res.status(500).json({ message: "Error al actualizar la tienda", error: err });
    }
};


exports.createTienda=async(req, res)=>{
    try {
        const {
            id_usuario,
            nombre,
            direccion,
            telefono,
            estado
        } = req.body;

        await Tienda.create({
            id_usuario,
            nombre,
            direccion,
            telefono,
            estado
        });

        res.status(201).json({message : "Se creo con exto la tienda"});

    } catch (err) {
        res.status(500).json({ message: 'Error al crear la tienda', error: err });
    }
}