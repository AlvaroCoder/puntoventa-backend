module.exports = (sequelize, DataTypes) => {
    const ProductoEstandar = sequelize.define('ProductoEstandar', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      codigo_barras: {
        type: DataTypes.STRING(100),
        unique: true
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT
      },
      contenido_neto: {
        type: DataTypes.DECIMAL(10, 3)
      },
      unidad_medida: {
        type: DataTypes.STRING(50)
      },
      peso_gramos: {
        type: DataTypes.DECIMAL(8, 2)
      },
      volumen_ml: {
        type: DataTypes.DECIMAL(8, 2)
      },
      caracteristicas: {
        type: DataTypes.JSON
      },
      imagen_url: {
        type: DataTypes.STRING(500)
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'productos_estandar',
      timestamps: true
    });
  
    ProductoEstandar.associate = function(models) {
      ProductoEstandar.belongsTo(models.MarcaEstandar, {
        foreignKey: 'marca_id',
        as: 'marca'
      });
      ProductoEstandar.belongsTo(models.CategoriaEstandar, {
        foreignKey: 'categoria_id',
        as: 'categoria'
      });
      ProductoEstandar.belongsTo(models.PresentacionEstandar, {
        foreignKey: 'presentacion_id',
        as: 'presentacion'
      });
      ProductoEstandar.belongsTo(models.RubroNegocio, {
        foreignKey: 'rubro_id',
        as: 'rubro'
      });
      
      ProductoEstandar.hasMany(models.PrecioReferencia, {
        foreignKey: 'producto_id',
        as: 'precios_referencia'
      });
    };
  
    return ProductoEstandar;
  };