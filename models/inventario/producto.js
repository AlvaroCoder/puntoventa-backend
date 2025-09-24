module.exports = (sequelize, DataTypes) => {
    const Producto = sequelize.define('Producto', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT
      },
      precio_venta: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      precio_compra: {
        type: DataTypes.DECIMAL(10, 2)
      },
      stock_actual: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      stock_minimo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      unidad_medida: {
        type: DataTypes.STRING(50),
        defaultValue: 'UNIDAD'
      },
      impuesto_porcentaje: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 0
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'productos',
      timestamps: true
    });
  
    Producto.associate = function(models) {
      Producto.belongsTo(models.Empresa, {
        foreignKey: 'empresa_id',
        as: 'empresa'
      });
      Producto.belongsTo(models.CategoriaProducto, {
        foreignKey: 'categoria_id',
        as: 'categoria'
      });
      
      Producto.hasMany(models.InventarioTienda, {
        foreignKey: 'producto_id',
        as: 'inventarios_tienda'
      });
      Producto.hasMany(models.VentaDetalle, {
        foreignKey: 'producto_id',
        as: 'detalles_venta'
      });
      Producto.hasMany(models.MovimientoInventario, {
        foreignKey: 'producto_id',
        as: 'movimientos'
      });
    };
  
    return Producto;
  };