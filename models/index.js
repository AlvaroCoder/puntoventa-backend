
const models = {
  Usuario: require('./core/usuarios'), 
  Empresa: require('./core/empresa'),  
  Tienda: require('./core/tienda'), 
  Trabajador: require('./core/trabajador'),
  Rol: require('./core/rol'),
  RegistroAsistencia: require('./core/registroAsistencia'),
  TrabajadorRoles: require('./core/trabajadorRoles'),
  RolPermisos: require('./core/rolPermisos'),
  ModulosSistema: require('./core/modulosSistema'),
  ConfigPuntos : require('./core/configPuntos'),
  ProductoVariantes : require('./core/productoVariantes'),

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
  CajaSesiones : require('./caja/cajaSesiones'),

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
  TransaccionPago: require('./pagos/transaccionPago'),

  NubefactLog: require('./nubefact/nubefactLog'),
  NubefactConfig: require('./nubefact/nubefactConfig'),

  OrdenesCompra: require('./logistica/ordendesCompra'),
  OrdenesCompraDetalle: require('./logistica/ordenesCompraDetalle'),
  EntradasMercancia : require('./logistica/entradaMercancia')
};

models.Trabajador.belongsTo(models.Rol, { foreignKey: 'rol_id', as: 'rol' });
models.Rol.hasMany(models.Trabajador, { foreignKey: 'rol_id', as: 'trabajadores' });

models.SuscripcionEmpresa.belongsTo(models.PlanSuscripcion, { foreignKey: 'plan_id', as: 'plan' });
models.PlanSuscripcion.hasMany(models.SuscripcionEmpresa, { foreignKey: 'plan_id', as: 'suscripciones' });

module.exports = models;