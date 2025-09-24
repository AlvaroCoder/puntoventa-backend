module.exports = (sequelize, DataTypes) => {
    const CategoriaProducto = sequelize.define('CategoriaProducto', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      descripcion: {
        type: DataTypes.TEXT
      },
      codigo: {
        type: DataTypes.STRING(50)
      },
      activa: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'categorias_productos',
      timestamps: true
    });
  
    CategoriaProducto.associate = function(models) {
      CategoriaProducto.belongsTo(models.Empresa, {
        foreignKey: 'empresa_id',
        as: 'empresa'
      });
      CategoriaProducto.belongsTo(models.CategoriaProducto, {
        foreignKey: 'categoria_padre_id',
        as: 'categoria_padre'
      });
      
      CategoriaProducto.hasMany(models.CategoriaProducto, {
        foreignKey: 'categoria_padre_id',
        as: 'subcategorias'
      });
      CategoriaProducto.hasMany(models.Producto, {
        foreignKey: 'categoria_id',
        as: 'productos'
      });
    };
  
    return CategoriaProducto;
  };