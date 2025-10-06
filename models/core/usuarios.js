const sequelize = require('../../config/db');
const {DataTypes} = require("sequelize");

const Usuarios = sequelize.define("usuarios",{
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    email : {
        type : DataTypes.STRING(255),
        allowNull : false,
        unique : true,
        validate : {
            isEmail : {
                msg : "Ingrese un email valido"
            },
            len : {
                args : [0,255],
                msg : "El email no puede ser mayor de 255 caracteres"
            }
        }
    },
    password_hash : {
        type : DataTypes.STRING(255),
        allowNull : false,
    },
    nombre_completo : {
        type : DataTypes.STRING(255),
        allowNull : false,
        unique : true,
        validate : {
            len: {
                args : [0,255],
                msg : "El nombre no puede ser de más de 255 caracteres"
            },
            notEmpty: {
                msg: "El nombre no puede estar vacío"
            }
        }
    },
    ruc_dni : {
        type : DataTypes.STRING(20),
        unique : true,
        allowNull : false,
        validate : {
            len : {
                args : [8,11],
                msg : "El documento debe tener entre 8 y 11 caracteres"
            },
            esDocumentoValido(value){
                if (!value) return;
                
                if (!/^\d+$/.test(value)) {
                    throw new Error('El documento solo puede contener números');
                }

                if (value.length === 8) {
                    const dni = parseInt(value);
                    if (dni < 10000000 || dni > 99999999) {
                        throw new Error('DNI no válido');
                    }
                }

                if (value.length === 11) {
                    const ruc = value;
                    
                    const primerosDigitos = ruc.substring(0, 2);
                    const digitosValidos = ['10', '15', '17', '20'];
                    if (!digitosValidos.includes(primerosDigitos)) {
                        throw new Error('RUC no válido - Los primeros dígitos deben ser 10, 15, 17 o 20');
                    }
                    
                }
            }
        }
    },
    telefono : {
        type : DataTypes.STRING(20),
        allowNull : true,
        validate : {
            is: {
                args: /^[0-9+\-\s()]*$/i,
                msg: "Formato de teléfono no válido"
            }
        }
    },
    fecha_registro : {
        type : DataTypes.DATE,
        defaultValue : DataTypes.NOW
    },
    activo : {
        type : DataTypes.BOOLEAN,
        defaultValue : true,
    },
    ultimo_login : {
        allowNull : true,
        type : DataTypes.DATE,
        defaultValue : null
    }
},{
    tableName : 'usuarios',
    timestamps : false
});

module.exports =Usuarios;