const sequelize = require('../../config/db');
const { DataTypes, NOW } = require('sequelize');

const MlPredicciones = sequelize.define('ml_ventas_snapshot', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        autoIncrement: true,
        primaryKey : true
    },
    tienda_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tiendas',
            key : 'id'
        }
    },
    empresa_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'empresas',
            key : 'id'
        }
    },
    producto_id: {
        type: DataTypes.INTEGER,
        allowNull : false
    },
    variante_id: {
        type: DataTypes.INTEGER,
        allowNull : true
    },
    categoria_id: {
        type: DataTypes.INTEGER,
        allowNull : true
    },
    temporada: {
        type: DataTypes.STRING(50),
        allowNull : true
    },
    genero: {
        type: DataTypes.STRING(20),
        allowNull: true,
        defaultValue : 'M'
    },
    tipo_producto: {
        type: DataTypes.STRING(100),
        allowNull : true
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue : NOW
    },
    semana_iso: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue : 1
    },
    mes: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue : 1
    },
    anio: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        defaultValue: 2026
    },
    dia_semana: {
        type: DataTypes.TINYINT,
        allowNull: true
    },
    es_fin_semana: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : false
    },
    es_campana: {
        type: DataTypes.BOOLEAN,
        allowNull : false
    },
    nombre_campana: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue : 'gauss'
    },
    unidades_vendidas: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue : 1
    },
    ingresos_totales: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull : false
    },
    precio_promedio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        defaultValue : 1
    },
    stock_inicio: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue : 1
    },
    stock_fin: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue : 0
    },
    tasa_rotacion: {
        type: DataTypes.DECIMAL(8, 4),
        allowNull: true
    }
}, {
    tableName: 'ml_predicciones',
    timestamps: false,
    indexes: [
        { fields: ['tienda_id'] },
        {fields : ['empresa_id']}
    ]
});


module.exports = MlPredicciones;