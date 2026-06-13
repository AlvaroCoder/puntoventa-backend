

INSERT INTO `planes_suscripcion`
  (`nombre`, `descripcion`, `precio_mensual`, `precio_anual`, `moneda`,
   `limite_empleados`, `limite_tiendas`, `limite_productos`,
   `caracteristicas`, `activo`, `orden`)
VALUES

(
  'Básico',
  'Ideal para negocios que recién inician su digitalización. Incluye los módulos esenciales para vender, controlar inventario y manejar caja en un solo local.',
  89.00,          
  890.00,          
  'PEN',
  3,                
  1,                
  200,             
  JSON_OBJECT(
    'modulos', JSON_ARRAY(
      'inventario', 'pos', 'caja', 'clientes', 'trabajadores'
    ),
    'lector_codigo_barras', TRUE,
    'vista_dual', FALSE,
    'dashboard_gerencial', FALSE,
    'creditos', FALSE,
    'sistema_puntos', FALSE,
    'proveedores', FALSE,
    'ordenes_compra', FALSE,
    'reportes_exportables', FALSE,
    'nubefact', FALSE,
    'ia_predictiva', FALSE,
    'soporte', 'email'
  ),
  1,
  1
),

(
  'Estándar',
  'Para negocios en crecimiento con más de un local. Incluye gestión de créditos, sistema de puntos, proveedores y dashboard gerencial con reportes.',
  159.00,
  1590.00,
  'PEN',
  10,              
  2,                
  2000,             
  JSON_OBJECT(
    'modulos', JSON_ARRAY(
      'inventario', 'pos', 'caja', 'clientes', 'trabajadores',
      'creditos', 'puntos', 'proveedores', 'ordenes_compra',
      'entradas_mercancia', 'dashboard', 'reportes', 'rbac'
    ),
    'lector_codigo_barras', TRUE,
    'vista_dual', TRUE,
    'dashboard_gerencial', TRUE,
    'creditos', TRUE,
    'sistema_puntos', TRUE,
    'proveedores', TRUE,
    'ordenes_compra', TRUE,
    'ordenes_compra_abiertas', TRUE,
    'reportes_exportables', TRUE,
    'nubefact', FALSE,
    'ia_predictiva', FALSE,
    'soporte', 'email_prioritario'
  ),
  1,
  2
),

(
  'Full',
  'La solución completa para negocios multi-tienda. Incluye emisión de boletas y facturas electrónicas (Nubefact/SUNAT), inteligencia artificial para predicción de demanda y soporte prioritario.',
  289.00,
  2890.00,
  'PEN',
  0,              
  0,               
  0,               
  JSON_OBJECT(
    'modulos', JSON_ARRAY(
      'inventario', 'pos', 'caja', 'clientes', 'trabajadores',
      'creditos', 'puntos', 'proveedores', 'ordenes_compra',
      'entradas_mercancia', 'dashboard', 'reportes', 'rbac',
      'nubefact', 'configuracion', 'ia'
    ),
    'lector_codigo_barras', TRUE,
    'vista_dual', TRUE,
    'dashboard_gerencial', TRUE,
    'creditos', TRUE,
    'sistema_puntos', TRUE,
    'proveedores', TRUE,
    'ordenes_compra', TRUE,
    'ordenes_compra_abiertas', TRUE,
    'reportes_exportables', TRUE,
    'nubefact', TRUE,
    'ia_predictiva', TRUE,
    'ia_chatbot', TRUE,
    'multi_tienda_ilimitada', TRUE,
    'soporte', 'prioritario_24_7'
  ),
  1,
  3
);