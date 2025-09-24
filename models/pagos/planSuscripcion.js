module.exports = (sequelize, DataTypes) => {
    const PlanSuscripcion = sequelize.define('PlanSuscripcion', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      descripcion: {
        type: DataTypes.TEXT
      },
      precio_mensual: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      precio_anual: {
        type: DataTypes.DECIMAL(10, 2)
      },
      moneda: {
        type: DataTypes.STRING(10),
        defaultValue: 'USD'
      },
      limite_empleados: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      limite_tiendas: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      limite_productos: {
        type: DataTypes.INTEGER,
        defaultValue: 100
      },
      caracteristicas: {
        type: DataTypes.JSON
      },
      activo: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      orden: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    }, {
      tableName: 'planes_suscripcion',
      timestamps: true
    });
  
    PlanSuscripcion.associate = function(models) {
      PlanSuscripcion.hasMany(models.SuscripcionEmpresa, {
        foreignKey: 'plan_id',
        as: 'suscripciones'
      });
      PlanSuscripcion.hasMany(models.Empresa, {
        foreignKey: 'plan_actual_id',
        as: 'empresas_actuales'
      });
    };
  
    return PlanSuscripcion;
  };