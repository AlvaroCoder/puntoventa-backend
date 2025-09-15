USE pipoappdatabase;
-- 1. Tabla para Usuarios (Personal Administrativo)
CREATE TABLE usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    nombre_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol VARCHAR(20) DEFAULT 'administrador'
);

-- 2. Tabla para Clientes
CREATE TABLE clientes (
    id_cliente INT PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(100) NOT NULL,
    apellido_cliente VARCHAR(100) NOT NULL,
    dni_cliente VARCHAR(15) UNIQUE NOT NULL,
    deuda_actual DECIMAL(10, 2) DEFAULT 0.00,
    fecha_ultimo_pago DATE,
    puntuacion INT DEFAULT 0 -- Puntuación asignada por el administrador
);

-- 3. Tabla para Productos
CREATE TABLE productos (
    id_producto INT PRIMARY KEY AUTO_INCREMENT,
    nombre_producto VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL
);

-- 4. Tabla para Créditos (Productos a Crédito de los Clientes)
CREATE TABLE creditos (
    id_credito INT PRIMARY KEY AUTO_INCREMENT,
    id_cliente INT,
    id_producto INT,
    fecha_credito DATE DEFAULT CURRENT_DATE,
    precio_credito DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- 5. Tabla para Movimientos de Crédito (Historial de Créditos)
CREATE TABLE movimientos_credito (
    id_movimiento INT PRIMARY KEY AUTO_INCREMENT,
    id_credito INT,
    monto_movimiento DECIMAL(10, 2) NOT NULL,
    tipo_movimiento VARCHAR(50), -- Puede ser 'pago', 'ajuste', etc.
    fecha_movimiento DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (id_credito) REFERENCES creditos(id_credito)
);
