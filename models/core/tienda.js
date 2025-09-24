module.exports = (sequelize, DataTypes) => {
    const Tienda = sequelize.define('Tienda', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      codigo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      direccion: {
        type: DataTypes.TEXT
      },
      telefono: {
        type: DataTypes.STRING(20)
      },
      responsable: {
        type: DataTypes.STRING(255)
      },
      fecha_apertura: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW
      },
      activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'tiendas',
      timestamps: true
    });
  
    Tienda.associate = function(models) {
      Tienda.belongsTo(models.Empresa, {
        foreignKey: 'empresa_id',
        as: 'empresa'
      });
      
      Tienda.hasMany(models.Trabajador, {
        foreignKey: 'tienda_id',
        as: 'trabajadores'
      });
      Tienda.hasMany(models.InventarioTienda, {
        foreignKey: 'tienda_id',
        as: 'inventarios'
      });
      Tienda.hasMany(models.CajaTienda, {
        foreignKey: 'tienda_id',
        as: 'cajas'
      });
      Tienda.hasMany(models.Venta, {
        foreignKey: 'tienda_id',
        as: 'ventas'
      });
      Tienda.hasMany(models.RegistroAsistencia, {
        foreignKey: 'tienda_id',
        as: 'registros_asistencia'
      });
    };
  
    return Tienda;
  };