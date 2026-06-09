/**
 * Tablas que faltan
 * 1) Trabjador_roles
 * 2) Rol_permisos
 * 3) Modulos_sistema
 * 4) Nubefact_log
 * 5) COnfig_puntos
 * 6) Puntos_movimientos
 * 7) Ordenes_compra
 * 8) Ordenes_compra_detalle
 * 9) Caja_sesiones
 * 10) Entradas mercancia
 */
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
  VentaDetalle: require('./ventas/ventadetalle'),
  CreditoCliente: require('./ventas/creditocliente'),
  PagoCredito: require('./ventas/pagoCredito'),
  
  CajaTienda: require('./caja/cajatienda'),
  CajaMovimiento: require('./caja/cajamovimiento'),

  RubroNegocio: require('./estandar/rubronegocio'),
  MarcaEstandar: require('./estandar/marcaEstandar'),
  CategoriaEstandar: require('./estandar/categoriaestandar'),
  PresentacionEstandar: require('./estandar/presentacionestandar'),
  ProductoEstandar: require('./estandar/productoEstandar'),
  PrecioReferencia: require('./estandar/precioreferencia'),
  ImportacionProducto: require('./estandar/importacionproducto'),
  LogImportacion: require('./estandar/logImportacion'),
  
  PlanSuscripcion: require('./pagos/planSuscripcion'),
  SuscripcionEmpresa: require('./pagos/suscripcionEmpresa'),
  FacturaPago: require('./pagos/facturaPago'),
  TransaccionPago: require('./pagos/transaccionPago')
};


models.Trabajador.belongsTo(models.Rol, { foreignKey: 'rol_id', as: 'rol' });
models.Rol.hasMany(models.Trabajador, { foreignKey: 'rol_id', as: 'trabajadores' });

models.SuscripcionEmpresa.belongsTo(models.PlanSuscripcion, { foreignKey: 'plan_id', as: 'plan' });
models.PlanSuscripcion.hasMany(models.SuscripcionEmpresa, { foreignKey: 'plan_id', as: 'suscripciones' });

module.exports = models;