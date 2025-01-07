const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Cliente = sequelize.define('clientes', {
    id_cliente : {
      type : DataTypes.INTEGER,
      primaryKey : true
    },
    nombre_cliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido_cliente: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dni_cliente: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    deuda_actual: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    fecha_ultimo_pago: {
      type: DataTypes.DATE,
    },
    puntuacion: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    }},{
      timestamps : false
    }
  );

module.exports = Cliente;
