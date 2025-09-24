module.exports = (sequelize, DataTypes) => {
    const RegistroAsistencia = sequelize.define('RegistroAsistencia', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fecha: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      hora_entrada: {
        type: DataTypes.TIME
      },
      hora_salida: {
        type: DataTypes.TIME
      },
      tipo_registro: {
        type: DataTypes.STRING(20),
        defaultValue: 'manual'
      },
      observaciones: {
        type: DataTypes.TEXT
      },
      ip_dispositivo: {
        type: DataTypes.STRING(45)
      }
    }, {
      tableName: 'registros_asistencia',
      timestamps: true
    });
  
    RegistroAsistencia.associate = function(models) {
      RegistroAsistencia.belongsTo(models.Trabajador, {
        foreignKey: 'trabajador_id',
        as: 'trabajador'
      });
      RegistroAsistencia.belongsTo(models.Tienda, {
        foreignKey: 'tienda_id',
        as: 'tienda'
      });
    };
  
    return RegistroAsistencia;
  };