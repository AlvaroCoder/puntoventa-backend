module.exports = (sequelize, DataTypes) => {
    const Empresa = sequelize.define('Empresa', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_empresa: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      nombre_comercial: {
        type: DataTypes.STRING(255)
      },
      ruc: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      direccion: {
        type: DataTypes.TEXT
      },
      telefono: {
        type: DataTypes.STRING(20)
      },
      email: {
        type: DataTypes.STRING(255)
      },
      logo_url: {
        type: DataTypes.STRING(500)
      },
      moneda_base: {
        type: DataTypes.STRING(10),
        defaultValue: 'PEN'
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      tableName: 'empresas',
      timestamps: true
    });
  
    Empresa.associate = function(models) {
      Empresa.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        as: 'usuario'
      });
      Empresa.belongsTo(models.RubroNegocio, {
        foreignKey: 'rubro_id',
        as: 'rubro'
      });
      Empresa.belongsTo(models.PlanSuscripcion, {
        foreignKey: 'plan_actual_id',
        as: 'plan_actual'
      });
      
      Empresa.hasMany(models.Tienda, {
        foreignKey: 'empresa_id',
        as: 'tiendas'
      });
      Empresa.hasMany(models.Trabajador, {
        foreignKey: 'empresa_id',
        as: 'trabajadores'
      });
      Empresa.hasMany(models.Producto, {
        foreignKey: 'empresa_id',
        as: 'productos'
      });
      Empresa.hasMany(models.Cliente, {
        foreignKey: 'empresa_id',
        as: 'clientes'
      });
      Empresa.hasMany(models.Venta, {
        foreignKey: 'empresa_id',
        as: 'ventas'
      });
      Empresa.hasMany(models.ImportacionProducto, {
        foreignKey: 'empresa_id',
        as: 'importaciones'
      });
      Empresa.hasMany(models.SuscripcionEmpresa, {
        foreignKey: 'empresa_id',
        as: 'suscripciones'
      });
    };
  
    return Empresa;
  };