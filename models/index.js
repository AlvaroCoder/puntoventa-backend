const NubefactLog = require('./nubefact/nubefactLog');

/**
 * Tablas que faltan
 * 5) COnfig_puntos
 * 6) Puntos_movimientos
 * 7) Ordenes_compra
 * 8) Ordenes_compra_detalle
 * 9) Caja_sesiones
 * 10) Entradas mercancia
 * 11) Ml_predicciones
 * 12) IA_conversaciones
 */
const models = {
  Usuario: require('./core/usuarios'), // Check
  Empresa: require('./core/empresa'),  // Check
  Tienda: require('./core/tienda'),  // Check
  Trabajador: require('./core/trabajador'), // Check
  Rol: require('./core/rol'), // Check
  RegistroAsistencia: require('./core/registroAsistencia'), // Check
  TrabajadorRoles: require('./core/trabajadorRoles'), // Check
  RolPermisos: require('./core/rolPermisos'), // Check
  ModulosSistema: require('./core/modulosSistema'), // Check

  CategoriaProducto: require('./inventario/categoriaProducto'), // Check
  Producto: require('./inventario/producto'), // Check
  InventarioTienda: require('./inventario/inventarioTienda'), // Check
  MovimientoInventario: require('./inventario/movimientoinventario'), 
  Proveedor: require('./inventario/proveedor'), // Check
  
  Cliente: require('./ventas/cliente'), // Check
  Venta: require('./ventas/venta'), // Check
  VentaDetalle: require('./ventas/ventadetalle'), // Check
  CreditoCliente: require('./ventas/creditocliente'), // Check
  PagoCredito: require('./ventas/pagoCredito'), // Check
  
  CajaTienda: require('./caja/cajatienda'), // Check
  CajaMovimiento: require('./caja/cajamovimiento'), // Check

  RubroNegocio: require('./estandar/rubronegocio'), // Check
  MarcaEstandar: require('./estandar/marcaEstandar'), // Check
  CategoriaEstandar: require('./estandar/categoriaestandar'), // Check
  PresentacionEstandar: require('./estandar/presentacionestandar'), // Check
  ProductoEstandar: require('./estandar/productoEstandar'), // Check
  PrecioReferencia: require('./estandar/precioreferencia'), 
  ImportacionProducto: require('./estandar/importacionproducto'), // Check
  LogImportacion: require('./estandar/logImportacion'),
  
  PlanSuscripcion: require('./pagos/planSuscripcion'), // Check
  SuscripcionEmpresa: require('./pagos/suscripcionEmpresa'), // Check
  FacturaPago: require('./pagos/facturaPago'), // Check
  TransaccionPago: require('./pagos/transaccionPago'), // Check

  NubefactLog: require('./nubefact/nubefactLog'),
  NubefactConfig: require('./nubefact/nubefactConfig')
};

models.Trabajador.belongsTo(models.Rol, { foreignKey: 'rol_id', as: 'rol' });
models.Rol.hasMany(models.Trabajador, { foreignKey: 'rol_id', as: 'trabajadores' });

models.SuscripcionEmpresa.belongsTo(models.PlanSuscripcion, { foreignKey: 'plan_id', as: 'plan' });
models.PlanSuscripcion.hasMany(models.SuscripcionEmpresa, { foreignKey: 'plan_id', as: 'suscripciones' });

module.exports = models;