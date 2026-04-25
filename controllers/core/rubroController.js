const Rubro = require('../../models/core/rubro'); 

exports.obtenerRubros = async (req, res) => {
    try {
        const rubros = await Rubro.findAll({
            where: { activo: true },
            attributes: ['id', 'nombre', 'descripcion', 'icono'] 
        });
        res.json({ rubros });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener los rubros' });
    }
};

exports.obtenerRubroPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const rubro = await Rubro.findByPk(id);

        if (!rubro) {
            return res.status(404).json({ msg: 'Rubro no encontrado' });
        }

        res.json({ rubro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al obtener el rubro' });
    }
};

exports.crearRubro = async (req, res) => {
    const { nombre, descripcion, icono } = req.body;

    try {
        const rubroExistente = await Rubro.findOne({ where: { nombre } });
        if (rubroExistente) {
            return res.status(400).json({ msg: 'Ya existe un rubro con ese nombre' });
        }

        const nuevoRubro = await Rubro.create({
            nombre,
            descripcion,
            icono,
            activo: true
        });

        res.status(201).json({
            msg: 'Rubro creado exitosamente',
            rubro: nuevoRubro
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al crear el rubro' });
    }
};

exports.actualizarRubro = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, icono, activo } = req.body;

    try {
        const rubro = await Rubro.findByPk(id);

        if (!rubro) {
            return res.status(404).json({ msg: 'Rubro no encontrado' });
        }

        rubro.nombre = nombre || rubro.nombre;
        rubro.descripcion = descripcion || rubro.descripcion;
        rubro.icono = icono || rubro.icono;
        if (activo !== undefined) rubro.activo = activo;

        await rubro.save();

        res.json({
            msg: 'Rubro actualizado correctamente',
            rubro
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al actualizar el rubro' });
    }
};

exports.eliminarRubro = async (req, res) => {
    const { id } = req.params;

    try {
        const rubro = await Rubro.findByPk(id);

        if (!rubro) {
            return res.status(404).json({ msg: 'Rubro no encontrado' });
        }

        rubro.activo = false;
        await rubro.save();

        res.json({ msg: 'Rubro desactivado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Hubo un error al eliminar el rubro' });
    }
};