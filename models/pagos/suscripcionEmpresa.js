const sequelize = require("../../config/db");
const { DataTypes } = require("sequelize");

const SuscripcionEmpresa = sequelize.define(
  "suscripciones_empresas",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    empresa_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "empresas", key: "id" },
    },
    plan_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "planes_suscripcion", key: "id" },
    },
    estado: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "trial", 
      validate: {
        isIn: {
          args: [
            [
              "trial",
              "activa",
              "pendiente",
              "suspendida",
              "cancelada",
              "expirada",
            ],
          ],
          msg: "Estado de suscripción no válido",
        },
      },
    },
    es_trial: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: { msg: "La fecha de inicio debe ser válida" },
      },
    },
    fecha_fin_trial: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: true,
     
    },
    fecha_proximo_pago: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: { msg: "La fecha de próximo pago debe ser válida" },
      },
    },
    metodo_pago: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        isIn: {
          args: [
            ["culqi", "yape", "plin", "transferencia", "efectivo", "stripe"],
          ],
          msg: "Método de pago no válido",
        },
      },
    },
    id_pago_externo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    datos_pago: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ciclo_facturacion: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "mensual",
      validate: {
        isIn: {
          args: [["mensual", "anual"]],
          msg: "Ciclo de facturación no válido",
        },
      },
    },
  },
  {
    tableName: "suscripciones_empresas",
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ["empresa_id"],
        name: "uk_empresa_suscripcion",
      },
      {
        fields: ["estado"],
        name: "idx_estado",
      },
      {
        fields: ["fecha_proximo_pago"],
        name: "idx_fecha_proximo_pago",
      },
      {
        fields: ["fecha_fin_trial"],
        name: "idx_fecha_fin_trial",
      },
    ],
  },
);

module.exports = SuscripcionEmpresa;
