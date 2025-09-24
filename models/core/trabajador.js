module.exports = (sequelize, DataTypes) => {
    const Trabajador = sequelize.define('Trabajador', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo_empleado: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      nombre_completo: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      tipo_documento: {
        type: DataTypes.STRING(10),
        defaultValue: 'DNI'
      },
      numero_documento: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING(255)
      },
      telefono: {
        type: DataTypes.STRING(20)
      },
      fecha_contratacion: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
      },
      salario_base: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'trabajadores',
      timestamps: true
    });
  
    Trabajador.associate = function(models) {
      Trabajador.belongsTo(models.Empresa, {
        foreignKey: 'empresa_id',
        as: 'empresa'
      });
      Trabajador.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      Trabajador.belongsTo(models.Tienda, {
        foreignKey: 'tienda_id',
        as: 'tienda'
      });
      
      Trabajador.belongsToMany(models.Rol, {
        through: 'trabajador_roles',
        foreignKey: 'trabajador_id',
        otherKey: 'rol_id',
        as: 'roles'
      });
      
      Trabajador.hasMany(models.RegistroAsistencia, {
        foreignKey: 'trabajador_id',
        as: 'registros_asistencia'
      });
      Trabajador.hasMany(models.Venta, {
        foreignKey: 'trabajador_id',
        as: 'ventas'
      });
      Trabajador.hasMany(models.CajaMovimiento, {
        foreignKey: 'trabajador_id',
        as: 'movimientos_caja'
      });
    };
  
    return Trabajador;
  };