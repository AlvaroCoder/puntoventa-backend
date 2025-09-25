const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize")

const CategoriaProducto = sequelize.define("categorias_productos",{
  id : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    unique : true
  },
  empresa_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : "empresas",
      key : "id"
    }
  },
  nombre : {
    type : DataTypes.STRING(255),
    allowNull : false,
    validate : {
      notEmpty : {
        msg : "El nombre de la categoria es requerido"
      }
    }
  },
  descripcion : {
    type : DataTypes.TEXT,
  },
  codigo : {
    type : DataTypes.STRING(50),
    allowNull : true,
    unique : true
  },
  activa : {
    type : DataTypes.BOOLEAN,
    defaultValue : true
  }
},{
  tableName : "categorias_productos",
  indexes : [
    {
      fields : ['id']
    },
    {
      fields : ['empresa_id']
    }
  ]
})

module.exports = CategoriaProducto;