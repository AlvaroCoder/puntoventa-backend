module.exports = (sequelize, DataTypes) => {
    const Venta = sequelize.define('Venta', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      numero_venta: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      fecha_venta: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      impuesto: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      descuento: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      estado: {
        type: DataTypes.STRING(20),
        defaultValue: 'completada'
      },
      tipo_pago: {
        type: DataTypes.STRING(20),
        defaultValue: 'efectivo'
      },
      observaciones: {
        type: DataTypes.TEXT
      }
    }, {
      tableName: 'ventas',
      timestamps: true
    });
  
    Venta.associate = function(models) {
      Venta.belongsTo(models.Empresa, {
        foreignKey: 'empresa_id',
        as: 'empresa'
      });
      Venta.belongsTo(models.Tienda, {
        foreignKey: 'tienda_id',
        as: 'tienda'
      });
      Venta.belongsTo(models.CajaTienda, {
        foreignKey: 'caja_id',
        as: 'caja'
      });
      Venta.belongsTo(models.Trabajador, {
        foreignKey: 'trabajador_id',
        as: 'trabajador'
      });
      Venta.belongsTo(models.Cliente, {
        foreignKey: 'cliente_id',
        as: 'cliente'
      });
      
      Venta.hasMany(models.VentaDetalle, {
        foreignKey: 'venta_id',
        as: 'detalles'
      });
      Venta.hasOne(models.CreditoCliente, {
        foreignKey: 'venta_id',
        as: 'credito'
      });
    };
  
    return Venta;
  };