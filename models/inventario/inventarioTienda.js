module.exports = (sequelize, DataTypes) => {
    const InventarioTienda = sequelize.define('InventarioTienda', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      stock_disponible: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      stock_minimo: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      ubicacion: {
        type: DataTypes.STRING(100)
      }
    }, {
      tableName: 'inventario_tienda',
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ['producto_id', 'tienda_id']
        }
      ]
    });
  
    InventarioTienda.associate = function(models) {
      InventarioTienda.belongsTo(models.Producto, {
        foreignKey: 'producto_id',
        as: 'producto'
      });
      InventarioTienda.belongsTo(models.Tienda, {
        foreignKey: 'tienda_id',
        as: 'tienda'
      });
    };
  
    return InventarioTienda;
  };