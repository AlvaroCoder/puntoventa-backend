const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize");

const InventarioTienda = sequelize.define("inventario_tienda",{
  id : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    allowNull : false,
    autoIncrement : true
  },
  producto_id : {
    type : DataTypes.INTEGER,
    allowNull : false
  },
  tienda_id : {
    type : DataTypes.INTEGER,
    allowNull : false
  },
  stock_disponible : {
    type : DataTypes.INTEGER,
    defaultValue : 0,
    validate : {
      min : {
        args : [0],
        msg : "El stock no puede ser negativo"
      }
    }
  },
  stock_minimo : {
    type : DataTypes.INTEGER,
    defaultValue : 0,
    validate : {
      min : {
        args : [0],
        msg : "El stock no puede ser negativo"
      }
    }
  },
  ubicacion : {
    type : DataTypes.STRING(100),
    allowNull : true
  }
},{
  tableName : "inventario_tienda",
  indexes : [
    {
      fields : ['id']
    },
    {
      fields : ['producto_id']
    },
    {
      fields : ['tienda_id']
    }
  ]
});

module.exports = InventarioTienda;