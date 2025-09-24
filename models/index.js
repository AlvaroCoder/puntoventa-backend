const { Sequelize } = require('sequelize');
const config = require('../config/db');

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.logging,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      paranoid: true 
    }
  }
);

// Importar modelos
const models = {
  Usuario: require('./core/usuario')(sequelize, Sequelize),
  Empresa: require('./core/empresa')(sequelize, Sequelize),
  Tienda: require('./core/tienda')(sequelize, Sequelize),
  Trabajador: require('./core/trabajador')(sequelize, Sequelize),
  Rol: require('./core/rol')(sequelize, Sequelize),
  RegistroAsistencia: require('./core/registroAsistencia')(sequelize, Sequelize),
  
  // Inventario
  CategoriaProducto: require('./inventario/categoriaProducto')(sequelize, Sequelize),
  Producto: require('./inventario/producto')(sequelize, Sequelize),
  InventarioTienda: require('./inventario/inventarioTienda')(sequelize, Sequelize),
  MovimientoInventario: require('./inventario/movimientoInventario')(sequelize, Sequelize),
  Proveedor: require('./inventario/proveedor')(sequelize, Sequelize),
  
  // Ventas
  Cliente: require('./ventas/cliente')(sequelize, Sequelize),
  Venta: require('./ventas/venta')(sequelize, Sequelize),
  VentaDetalle: require('./ventas/ventaDetalle')(sequelize, Sequelize),
  CreditoCliente: require('./ventas/creditoCliente')(sequelize, Sequelize),
  PagoCredito: require('./ventas/pagoCredito')(sequelize, Sequelize),
  
  // Caja
  CajaTienda: require('./caja/cajaTienda')(sequelize, Sequelize),
  CajaMovimiento: require('./caja/cajaMovimiento')(sequelize, Sequelize),
  
  // Estandar
  RubroNegocio: require('./estandar/rubroNegocio')(sequelize, Sequelize),
  MarcaEstandar: require('./estandar/marcaEstandar')(sequelize, Sequelize),
  CategoriaEstandar: require('./estandar/categoriaEstandar')(sequelize, Sequelize),
  PresentacionEstandar: require('./estandar/presentacionEstandar')(sequelize, Sequelize),
  ProductoEstandar: require('./estandar/productoEstandar')(sequelize, Sequelize),
  PrecioReferencia: require('./estandar/precioReferencia')(sequelize, Sequelize),
  ImportacionProducto: require('./estandar/importacionProducto')(sequelize, Sequelize),
  LogImportacion: require('./estandar/logImportacion')(sequelize, Sequelize),
  
  // Pagos
  PlanSuscripcion: require('./pagos/planSuscripcion')(sequelize, Sequelize),
  SuscripcionEmpresa: require('./pagos/suscripcionEmpresa')(sequelize, Sequelize),
  FacturaPago: require('./pagos/facturaPago')(sequelize, Sequelize),
  TransaccionPago: require('./pagos/transaccionPago')(sequelize, Sequelize)
};

// Definir asociaciones
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;