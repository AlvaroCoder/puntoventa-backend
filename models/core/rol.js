module.exports = (sequelize, DataTypes) => {
    const Rol = sequelize.define('Rol', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: DataTypes.TEXT
      },
      nivel_permiso: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    }, {
      tableName: 'roles',
      timestamps: true
    });
  
    Rol.associate = function(models) {
      Rol.belongsToMany(models.Trabajador, {
        through: 'trabajador_roles',
        foreignKey: 'rol_id',
        otherKey: 'trabajador_id',
        as: 'trabajadores'
      });
    };
  
    return Rol;
  };