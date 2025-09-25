const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize");

const Roles = sequelize.define('roles',{
  id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    primaryKey : true
  },
  nombre : {
    type : DataTypes.STRING(50),
    allowNull : false,
    validate : {
      notEmpty : {
        msg : "El nombre del rol es requerido"
      },
      len : {
        args : [0,50],
        msg : "El nombre debe tener menos de 50 caracteres"
      }
    }
  },
  descripcion : {
    type : DataTypes.TEXT,
    allowNull : true
  },
  nivel_permiso : {
    type : DataTypes.INTEGER,
    defaultValue : 1
  }
},{
  tableName: 'roles',
  timestamps : true,
});

module.exports = Roles;