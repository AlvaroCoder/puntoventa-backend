const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize");

const Empresa = sequelize.define("empresas",{
    id : {
      type : DataTypes.INTEGER,
      primaryKey : true,
      autoIncrement : true,
      allowNull : false
    },
    usuario_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      references : {
        model : 'usuarios',
        key : 'id'
      }
    },
    rubro_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      references : {
        model : "rubros_negocios",
        key : 'id'
      }
    },
    plan_actual_id : {
      type : DataTypes.INTEGER,
      allowNull : false,
      references : {
        model : 'planes_suscripcion',
        key : 'id'
      }
    },
    fecha_ultimo_pago : {
      type : DataTypes.DATE,
      defaultValue : DataTypes.NOW
    },
    nombre_empresa : {
      type : DataTypes.STRING(255),
      allowNull : false,
      validate : {
        notEmpty : {
          msg : "Completa el nombre de la empresa"
        }
      }
    },
    nombre_comercial : {
      type : DataTypes.STRING(255),
      allowNull : false,
      validate : {
        notEmpty : {
          msg : "Completa el nombre de la empresa"
        }
      }
    },
    ruc : {
      type : DataTypes.STRING(20),
      unique : true,
      validate : {
        notEmpty : {
          msg : "Debe contener informacion el ruc"
        }
        ,len: {
          args: [11, 11],
          msg: "La longitud del RUC debe ser de 11 caracteres"
        }
      }
    },
    direccion  :{
      type : DataTypes.TEXT,
      allowNull : true
    },
    telefono : {
      type : DataTypes.STRING(20),
      allowNull : true,
      validate : {
        notEmpty : {
          msg : "Debe ser un numero positivo el telefono"
        },
        is: {
          args: /^[0-9+\-\s()]*$/i,
          msg: "Formato de teléfono no válido"
        }
      }
    },
    email : {
      type : DataTypes.STRING(255),
      allowNull : true,
      validate : {
        isEmail: {
            msg: "Debe ser un email válido"
        },
        len: {
            args: [0, 255],
            msg: "El email no puede ser mayor de 255 caracteres"
        }        
      }
    },
    logo_url : {
      allowNull : true,
      type : DataTypes.STRING(500),
      defaultValue : ""
    },
    moneda_base : {
      type : DataTypes.STRING(10)
    },
    fecha_creacion : {
      type : DataTypes.DATE,
      defaultValue : DataTypes.NOW
    },
    activo : {
      type : DataTypes.BOOLEAN,
      defaultValue : true
    }
},{
  tableName : 'empresas',
  timestamps : false,
});

module.exports = Empresa;