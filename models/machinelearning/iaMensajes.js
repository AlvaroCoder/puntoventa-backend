const sequelize = require('../../config/db');
const { DataTypes } = require('sequelize');

const IAMensajes = sequelize.define('ia_mensajes', {  
    id: {
        type: DataTypes.BIGINT,  
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    conversacion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'ia_conversaciones',
            key: 'id'
        }
    },
    rol: {
        type: DataTypes.ENUM('user', 'assistant', 'system', 'tool'),
        allowNull: false
    },
    contenido: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "El contenido del mensaje no puede estar vacío"
            }
        }
    },
    tokens_entrada: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "Los tokens de entrada no pueden ser negativos"
            }
        }
    },
    tokens_salida: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: "Los tokens de salida no pueden ser negativos"
            }
        }
    },
    modelo_ia: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    herramienta: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'ia_mensajes',
    timestamps: false, 
    indexes: [
        { fields: ['conversacion_id'] },
        { fields: ['fecha_hora'] }
    ]
});

module.exports = IAMensajes;