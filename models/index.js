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
  
  // Pagos
  PlanSuscripcion: require('./pagos/planSuscripcion'),
  SuscripcionEmpresa: require('./pagos/suscripcionEmpresa'),
  FacturaPago: require('./pagos/facturaPago'),
  TransaccionPago: require('./pagos/transaccionPago')
};


module.exports = models;