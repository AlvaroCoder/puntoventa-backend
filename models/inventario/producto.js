const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize")

const Producto = sequelize.define("Producto",{
  id : {
    type : DataTypes.INTEGER,
    primaryKey : true,
    unique : true,
    allowNull : false,
    autoIncrement : true
  },
  empresa_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : 'empresas',
      key : 'id'
    }
  },
  categoria_id : {
    type : DataTypes.INTEGER,
    allowNull : false,
    references : {
      model : 'categoria_productos',
      key : 'id'
    }
  },
  codigo : {
    type : DataTypes.STRING(100),
    allowNull : false,
    unique : true,
    validate : {
      notEmpty : {
        msg :"El codigo del producto es requerido"
      }
    }
  },
  nombre : {
    type : DataTypes.STRING(255),
    allowNull : false,
    validate : {
      notEmpty : {
        msg : "EL campo de nombre es requerido"
      }
    }
  },
  descripcion : {
    type : DataTypes.TEXT,
    allowNull : true
  },
  precio_venta :{
    type : DataTypes.DECIMAL(10,2),
    allowNull : false,
    validate :{
      min : {
        args : [0],
        msg : "El precio de venta no puede ser negativo"
      }
    }
  },
  precio_compra : {
    type : DataTypes.DECIMAL(10,2),
    allowNull : true,
    validate :{
      min : {
        args : [0],
        msg : "El precio de venta no puede ser negativo"
      }
    }
  },
  stock_actual : {
    type : DataTypes.INTEGER,
    defaultValue : 0,
    validate :{
      min : {
        args : [0],
        msg : "El stock no puede ser negativo"
      }
    }
  },
  stock_minimo : {
    type : DataTypes.INTEGER,
    defaultValue : 0,
    validate :{
      min : {
        args : [0],
        msg : "El stock no puede ser negativo"
      }
    }
  },
  unidad_medida : {
    type : DataTypes.STRING(50),
    defaultValue : "UNIDAD",
  },
  impuesto_porcentaje : {
    type : DataTypes.DECIMAL(5,2),
    defaultValue : 0,
    validate :{
      min : {
        args : [0],
        msg : "El impuesto no puede ser negativo"
      },
      max : {
        args : [100],
        msg : "El impuesto no puede ser mayor de 100"
      }
    }
  },
  activo : {
    type : DataTypes.BOOLEAN,
    defaultValue : true
  },
  codigo_barras: {
    type: DataTypes.STRING(100),
    unique: true,
    defaultValue : ""
  },
  imagen_url: {
    type: DataTypes.STRING(500),
    defaultValue :""
  }
},{
  tableName : "productos",
  timestamps : true,
  paranoid : true,
  indexes : [
    {
      unique: true,
      fields: ['codigo']
    },
    {
      fields: ['empresa_id']
    },
    {
      fields: ['categoria_id']
    }
  ],
  hooks : {
    beforeValidate : (producto)=>{
      if (producto.codigo) {
        producto.codigo = producto.codigo.toUpperCase().trim();
      }
      if (producto.nombre) {
        producto.nombre = producto.nombre.trim();
      }
    },
    beforeCreate: (producto) => {
      if (!producto.codigo) {
        producto.codigo = `PROD-${Date.now()}`;
      }
    }
  }
});

module.exports = Producto;