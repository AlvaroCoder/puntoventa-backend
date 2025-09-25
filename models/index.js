const { Sequelize } = require('sequelize');
const config = require('../config/db');


// Importar modelos
const models = {
  Usuario: require('./core/usuarios'),
  Empresa: require('./core/empresa'),
  Tienda: require('./core/tienda'),
  Trabajador: require('./core/trabajador'),
  Rol: require('./core/rol'),
  RegistroAsistencia: require('./core/registroAsistencia'),
  
  CategoriaProducto: require('./inventario/categoriaProducto'),
  Producto: require('./inventario/producto'),
  InventarioTienda: require('./inventario/inventarioTienda'),
  MovimientoInventario: require('./inventario/movimientoinventario'),
  Proveedor: require('./inventario/proveedor'),
  
  Cliente: require('./ventas/cliente'),
  Venta: require('./ventas/venta'),
  VentaDetalle: require('./ventas/ventaDetalle')(sequelize, Sequelize),
  CreditoCliente: require('./ventas/creditoCliente')(sequelize, Sequelize),
  PagoCredito: require('./ventas/pagoCredito')(sequelize, Sequelize),
  
  CajaTienda: require('./caja/cajaTienda')(sequelize, Sequelize),
  CajaMovimiento: require('./caja/cajaMovimiento')(sequelize, Sequelize),
  
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