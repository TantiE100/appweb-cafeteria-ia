SET NAMES utf8mb4;
CREATE DATABASE IF NOT EXISTS santis_coffee CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE santis_coffee;

DROP TABLE IF EXISTS carrito_items;
DROP TABLE IF EXISTS carritos;
DROP TABLE IF EXISTS reservas;
DROP TABLE IF EXISTS pedido_items;
DROP TABLE IF EXISTS pedidos;
DROP TABLE IF EXISTS opciones_cafe;
DROP TABLE IF EXISTS contactos;
DROP TABLE IF EXISTS galeria;
DROP TABLE IF EXISTS especialidades;
DROP TABLE IF EXISTS productos;
DROP TABLE IF EXISTS categorias;
DROP TABLE IF EXISTS servicios;
DROP TABLE IF EXISTS sugerencias_chat;
DROP TABLE IF EXISTS navegacion;
DROP TABLE IF EXISTS textos;
DROP TABLE IF EXISTS agente;
DROP TABLE IF EXISTS cafeteria;

CREATE TABLE cafeteria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  eslogan VARCHAR(200) NOT NULL,
  titulo VARCHAR(150) NOT NULL,
  titulo_destacado VARCHAR(50) NOT NULL,
  ciudad VARCHAR(100) NOT NULL,
  historia TEXT NOT NULL,
  direccion VARCHAR(200) NOT NULL,
  telefono VARCHAR(30) NOT NULL,
  email VARCHAR(120) NOT NULL,
  horario VARCHAR(150) NOT NULL,
  video VARCHAR(255) NOT NULL
);

CREATE TABLE agente (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL,
  rol VARCHAR(100) NOT NULL,
  personalidad TEXT NOT NULL,
  reglas TEXT NOT NULL
);

CREATE TABLE textos (
  clave VARCHAR(80) PRIMARY KEY,
  valor TEXT NOT NULL
);

CREATE TABLE navegacion (
  id INT AUTO_INCREMENT PRIMARY KEY,
  etiqueta VARCHAR(60) NOT NULL,
  ruta VARCHAR(100) NOT NULL,
  icono VARCHAR(40) NOT NULL,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE sugerencias_chat (
  id INT AUTO_INCREMENT PRIMARY KEY,
  texto VARCHAR(120) NOT NULL,
  icono VARCHAR(40) NOT NULL,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE servicios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  icono VARCHAR(40) NOT NULL,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE categorias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  icono VARCHAR(40) NOT NULL,
  orden INT NOT NULL DEFAULT 0
);

CREATE TABLE productos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria_id INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  precio DECIMAL(8,2) NOT NULL,
  etiquetas VARCHAR(255) NOT NULL DEFAULT '',
  disponible BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

CREATE TABLE especialidades (
  id INT AUTO_INCREMENT PRIMARY KEY,
  producto_id INT NULL,
  nombre VARCHAR(100) NOT NULL,
  descripcion TEXT NOT NULL,
  imagen VARCHAR(255) NOT NULL,
  precio DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE galeria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(120) NOT NULL,
  imagen VARCHAR(255) NOT NULL
);

CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL,
  telefono VARCHAR(30),
  mensaje TEXT NOT NULL,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE opciones_cafe (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tipo ENUM('tamano', 'base', 'leche', 'extra', 'endulzante') NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  precio_extra DECIMAL(8,2) NOT NULL DEFAULT 0
);

CREATE TABLE carritos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sesion VARCHAR(64) NOT NULL UNIQUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE carrito_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  carrito_id INT NOT NULL,
  producto_id INT NULL,
  nombre VARCHAR(150) NOT NULL,
  precio_unitario DECIMAL(8,2) NOT NULL,
  cantidad INT NOT NULL,
  detalle VARCHAR(255) NULL,
  FOREIGN KEY (carrito_id) REFERENCES carritos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(12) NOT NULL UNIQUE,
  sesion VARCHAR(64) NULL,
  cliente VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NULL,
  modalidad ENUM('mesa', 'llevar', 'delivery') NOT NULL DEFAULT 'llevar',
  estado ENUM('recibido', 'preparando', 'listo', 'entregado', 'cancelado') NOT NULL DEFAULT 'recibido',
  metodo_pago ENUM('tarjeta', 'qr', 'efectivo') NOT NULL DEFAULT 'efectivo',
  pago_estado ENUM('pendiente', 'aprobado', 'reembolsado') NOT NULL DEFAULT 'pendiente',
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedido_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT NOT NULL,
  producto_id INT NULL,
  producto VARCHAR(150) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(8,2) NOT NULL,
  detalle VARCHAR(255) NULL,
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE,
  FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  codigo VARCHAR(12) NOT NULL UNIQUE,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(30) NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  personas INT NOT NULL,
  estado ENUM('confirmada', 'cancelada') NOT NULL DEFAULT 'confirmada',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
