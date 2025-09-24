module.exports = (sequelize, DataTypes) => {
    const Usuario = sequelize.define('Usuario', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      nombre_completo: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      ruc_dni: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: DataTypes.STRING(20)
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      ultimo_login: {
        type: DataTypes.DATE
      }
    }, {
      tableName: 'usuarios',
      timestamps: true,
      paranoid: true
    });
  
    Usuario.associate = function(models) {
      Usuario.hasMany(models.Empresa, {
        foreignKey: 'usuario_id',
        as: 'empresas'
      });
      Usuario.hasOne(models.Trabajador, {
        foreignKey: 'usuario_id',
        as: 'trabajador'
      });
    };
  
    return Usuario;
  };