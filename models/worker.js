const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Trabajador = sequelize.define("Trabajador", {
  id_trabajador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  id_tienda: {
    type : DataTypes.INTEGER,
    allowNull: false,
  },
  nombre: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING(100),
    allowNull: false, 
  },
  dni: {
    type: DataTypes.STRING(15),
    allowNull: false,
    unique: true,
  },
  puesto: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("trabajando", "vacaciones", "despedido", "intermitente"),
    defaultValue: "trabajando",
  },
  fecha_ingreso: {
    type: DataTypes.DATE,
  },
  fecha_salida: {
    type: DataTypes.DATE,
  },
  contrasenna_hash: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: "trabajadores",
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = Trabajador;