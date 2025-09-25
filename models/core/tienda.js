const sequelize = require('../../config/db');
const { DataTypes } = require("sequelize");

const Tienda = sequelize.define("tienda", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "empresas",
            key: 'id'
        }
    },
    nombre: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El nombre de la tienda es requerido"
            },
            len: {
                args: [2, 255],
                msg: "El nombre debe tener entre 2 y 255 caracteres"
            }
        }
    },
    codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: "El código de tienda ya existe"
        },
        validate: {
            notEmpty: {
                msg: "El código de la tienda es requerido"
            },
            len: {
                args: [1, 50],
                msg: "El código debe tener entre 1 y 50 caracteres"
            }
        }
    },
    direccion: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    telefono: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9+\-\s()]*$/i,
                msg: "Formato de teléfono no válido"
            }
        }
    },
    responsable: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
            len: {
                args: [0, 255],
                msg: "El nombre del responsable no puede exceder 255 caracteres"
            }
        }
    },
    fecha_apertura: {
        type: DataTypes.DATEONLY, 
        defaultValue: DataTypes.NOW,
        validate: {
            isDate: {
                msg: "La fecha de apertura debe ser válida"
            }
        }
    },
    activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'tiendas',  
    timestamps: true,      
    paranoid: true,        
    indexes: [
        {
            unique: true,
            fields: ['codigo']
        },
        {
            fields: ['empresa_id']
        },
        {
            fields: ['activa']
        }
    ],
    hooks: {
        beforeValidate: (tienda) => {
            if (tienda.codigo) {
                tienda.codigo = tienda.codigo.toUpperCase().trim();
            }
            if (tienda.nombre) {
                tienda.nombre = tienda.nombre.trim();
            }
            if (tienda.responsable) {
                tienda.responsable = tienda.responsable.trim();
            }
            if (tienda.telefono) {
                tienda.telefono = tienda.telefono.replace(/\s/g, '');
            }
        }
    }
});

module.exports = Tienda;