SET NAMES utf8mb4;
USE santis_coffee;

INSERT INTO cafeteria (nombre, eslogan, titulo, titulo_destacado, ciudad, historia, direccion, telefono, email, horario, video) VALUES
('Santi''s Coffee',
 'Dulce como Santi, café como Lucho.',
 'El Mejor Café de la Ciudad',
 'Mejor',
 'Cochabamba · Bolivia',
 'Santi''s Coffee nació en 2019 como un pequeño carrito de café en la Plaza Colón. Con granos de los Yungas y de Caranavi tostados en casa, pasamos de servir a vecinos y estudiantes a abrir nuestro local propio en 2022. Hoy seguimos tostando cada semana, trabajamos con productores bolivianos y preparamos cada taza con la misma paciencia del primer día: dulce como Santi, café como Lucho.',
 'Av. Ballivián 123, El Prado, Cochabamba',
 '+591 4 4000000',
 'hola@santiscoffee.bo',
 'Lunes a sábado de 7:30 a 21:00 · Domingos de 9:00 a 14:00',
 '/media/video/cafeteria.mp4');

INSERT INTO servicios (nombre, descripcion, icono, orden) VALUES
('Café de especialidad', 'Métodos espresso, V60, Chemex y prensa francesa con granos bolivianos de origen único.', '☕', 1),
('Desayunos y brunch', 'Desayunos completos, salteñas, sándwiches y opciones veganas todos los días.', '🥐', 2),
('Repostería artesanal', 'Tortas, cheesecakes y galletas horneadas cada mañana en nuestra cocina.', '🍰', 3),
('Café para llevar', 'Pide en barra o por WhatsApp y recoge tu bebida sin hacer fila.', '🥤', 4),
('Delivery', 'Llevamos tu pedido a domicilio dentro de Cochabamba con apps aliadas.', '🛵', 5),
('Eventos y catering', 'Barra de café móvil para reuniones, cumpleaños y eventos empresariales.', '🎉', 6),
('Coworking y Wi-Fi', 'Mesas amplias, enchufes y Wi-Fi rápido para estudiar o trabajar.', '💻', 7),
('Talleres de barismo', 'Cursos de fin de semana para aprender extracción, latte art y cata.', '🎓', 8);

INSERT INTO especialidades (nombre, descripcion, imagen, precio) VALUES
('Espresso Lucho', 'Doble espresso intenso de Caranavi, notas de cacao y panela.', '/media/img/especialidades/espresso.jpg', 14.00),
('Cappuccino Santi', 'Espresso, leche texturizada y un toque de canela y miel de caña.', '/media/img/especialidades/cappuccino.jpg', 20.00),
('Latte de vainilla', 'Latte suave con jarabe de vainilla hecho en casa y latte art.', '/media/img/especialidades/latte.jpg', 22.00),
('Cold brew de los Yungas', 'Café infusionado en frío por 18 horas, servido con hielo.', '/media/img/especialidades/cold-brew.jpg', 24.00),
('Mocha cochabambino', 'Espresso con chocolate boliviano, leche y crema batida.', '/media/img/especialidades/mocha.jpg', 24.00),
('Cheesecake de maracuyá', 'Cheesecake horneado con coulis de maracuyá del trópico.', '/media/img/especialidades/cheesecake.jpg', 26.00);

INSERT INTO categorias (nombre, orden) VALUES
('Cafés calientes', 1),
('Métodos de filtrado', 2),
('Bebidas frías', 3),
('Tés e infusiones', 4),
('Sin café', 5),
('Desayunos', 6),
('Salados', 7),
('Repostería', 8);

INSERT INTO productos (categoria_id, nombre, descripcion, precio, etiquetas, disponible) VALUES
(1, 'Espresso', 'Shot simple de espresso de la casa, blend de Caranavi.', 10.00, 'fuerte,intenso,clasico', TRUE),
(1, 'Espresso doble', 'Dos shots de espresso, cuerpo intenso.', 14.00, 'fuerte,intenso', TRUE),
(1, 'Ristretto', 'Extracción corta y concentrada.', 11.00, 'fuerte,intenso', TRUE),
(1, 'Macchiato', 'Espresso manchado con espuma de leche.', 13.00, 'fuerte,leche', TRUE),
(1, 'Americano', 'Espresso alargado con agua caliente.', 12.00, 'suave,clasico', TRUE),
(1, 'Cortado', 'Espresso con la misma cantidad de leche caliente.', 14.00, 'equilibrado,leche', TRUE),
(1, 'Flat white', 'Doble ristretto con microespuma sedosa.', 19.00, 'equilibrado,leche', TRUE),
(1, 'Cappuccino', 'Espresso, leche y espuma a partes iguales.', 18.00, 'clasico,leche,espuma', TRUE),
(1, 'Latte', 'Espresso con abundante leche texturizada.', 18.00, 'suave,leche', TRUE),
(1, 'Latte de vainilla', 'Latte con jarabe de vainilla hecho en casa.', 22.00, 'dulce,suave,leche', TRUE),
(1, 'Latte de caramelo salado', 'Latte con caramelo artesanal y una pizca de sal de Uyuni.', 23.00, 'dulce,leche', TRUE),
(1, 'Mocha', 'Espresso, chocolate boliviano y leche.', 22.00, 'dulce,chocolate,leche', TRUE),
(1, 'Mocha blanco', 'Espresso con chocolate blanco y leche.', 23.00, 'dulce,chocolate,leche', TRUE),
(1, 'Café con canela y chancaca', 'Café filtrado endulzado con chancaca y canela, receta de la abuela.', 15.00, 'dulce,tradicional', TRUE),
(1, 'Café con leche', 'Café filtrado con leche caliente, como en casa.', 13.00, 'suave,leche,tradicional', TRUE),
(2, 'V60 Caranavi', 'Origen único de Caranavi, notas de durazno y panela.', 22.00, 'suave,origen,filtrado', TRUE),
(2, 'V60 Samaipata', 'Microlote de Samaipata, notas florales y cítricas.', 26.00, 'suave,origen,filtrado,acido', TRUE),
(2, 'Chemex para dos', 'Café de origen preparado en Chemex, rinde dos tazas.', 34.00, 'compartir,filtrado', TRUE),
(2, 'Prensa francesa', 'Cuerpo completo y notas de cacao.', 20.00, 'intenso,filtrado', TRUE),
(2, 'AeroPress', 'Taza limpia y dulce, receta de campeonato.', 21.00, 'equilibrado,filtrado', TRUE),
(2, 'Sifón japonés', 'Preparación al vacío en mesa, una experiencia.', 30.00, 'experiencia,filtrado', TRUE),
(3, 'Cold brew', 'Café infusionado en frío por 18 horas.', 22.00, 'frio,suave', TRUE),
(3, 'Cold brew tónica', 'Cold brew con agua tónica y rodaja de naranja.', 25.00, 'frio,refrescante', TRUE),
(3, 'Iced latte', 'Espresso sobre leche fría y hielo.', 20.00, 'frio,leche', TRUE),
(3, 'Iced mocha', 'Espresso, chocolate, leche fría y hielo.', 23.00, 'frio,dulce,chocolate', TRUE),
(3, 'Frappé de café', 'Café, leche y hielo batidos con crema.', 24.00, 'frio,dulce,crema', TRUE),
(3, 'Frappé de caramelo', 'Frappé con caramelo artesanal y crema.', 25.00, 'frio,dulce,crema', TRUE),
(3, 'Affogato', 'Bola de helado de vainilla bañada en espresso.', 21.00, 'frio,dulce,postre', TRUE),
(3, 'Espresso tonic', 'Espresso sobre agua tónica y hielo.', 20.00, 'frio,refrescante,fuerte', TRUE),
(4, 'Té negro', 'Té negro de hoja entera.', 10.00, 'te,caliente', TRUE),
(4, 'Té verde jazmín', 'Té verde aromatizado con jazmín.', 12.00, 'te,suave', TRUE),
(4, 'Mate de coca', 'Infusión tradicional andina.', 8.00, 'infusion,tradicional', TRUE),
(4, 'Manzanilla con miel', 'Manzanilla con miel de abeja de Mizque.', 9.00, 'infusion,dulce', TRUE),
(4, 'Chai latte', 'Té negro especiado con leche.', 20.00, 'te,leche,especiado', TRUE),
(4, 'Matcha latte', 'Matcha ceremonial con leche.', 24.00, 'te,leche,verde', TRUE),
(4, 'Trimate', 'Coca, anís y manzanilla.', 8.00, 'infusion,tradicional', TRUE),
(5, 'Chocolate caliente', 'Chocolate boliviano al 70 % con leche.', 18.00, 'chocolate,dulce,sin cafe', TRUE),
(5, 'Api morado', 'Bebida tradicional de maíz morado con canela.', 10.00, 'tradicional,caliente,sin cafe', TRUE),
(5, 'Limonada con menta', 'Limón fresco, menta y hielo.', 14.00, 'frio,refrescante,sin cafe', TRUE),
(5, 'Jugo de naranja', 'Naranja exprimida al momento.', 15.00, 'frio,natural,sin cafe', TRUE),
(5, 'Batido de frutilla', 'Frutilla, leche y helado.', 20.00, 'frio,dulce,sin cafe', TRUE),
(5, 'Mocochinchi', 'Refresco tradicional de durazno deshidratado.', 9.00, 'frio,tradicional,sin cafe', TRUE),
(6, 'Desayuno americano', 'Huevos revueltos, tocino, pan tostado, jugo y café.', 38.00, 'completo,salado', TRUE),
(6, 'Desayuno cochabambino', 'Pan de arroz, queso fresco, api morado y buñuelos.', 32.00, 'tradicional,completo', TRUE),
(6, 'Tostado de palta', 'Pan de masa madre, palta y huevo pochado.', 30.00, 'saludable,vegetariano', TRUE),
(6, 'Bowl de frutas', 'Frutas de temporada, yogur y granola casera.', 26.00, 'saludable,vegetariano', TRUE),
(6, 'Panqueques con miel', 'Tres panqueques con miel y frutillas.', 28.00, 'dulce,vegetariano', TRUE),
(6, 'Omelette de queso y tomate', 'Tres huevos, queso menonita y tomate.', 27.00, 'salado,vegetariano', TRUE),
(7, 'Salteña de pollo', 'Salteña jugosa recién horneada.', 9.00, 'salado,tradicional', TRUE),
(7, 'Salteña de carne', 'Salteña clásica de carne con su jigote.', 9.00, 'salado,tradicional', TRUE),
(7, 'Empanada de queso', 'Empanada frita espolvoreada con azúcar.', 7.00, 'salado,tradicional,vegetariano', TRUE),
(7, 'Cuñapé', 'Pan de queso y almidón de yuca, recién salido.', 4.00, 'salado,tradicional,vegetariano', TRUE),
(7, 'Sándwich de chola', 'Pierna de cerdo, escabeche y quirquiña.', 25.00, 'salado,tradicional', TRUE),
(7, 'Croissant de jamón y queso', 'Croissant de mantequilla relleno.', 18.00, 'salado', TRUE),
(7, 'Wrap vegetariano', 'Hummus, verduras asadas y queso.', 26.00, 'salado,vegetariano,saludable', TRUE),
(8, 'Cheesecake de maracuyá', 'Porción individual con coulis de maracuyá.', 26.00, 'dulce,postre', TRUE),
(8, 'Torta de chocolate', 'Bizcocho húmedo con ganache de cacao boliviano.', 22.00, 'dulce,chocolate,postre', TRUE),
(8, 'Tres leches', 'Bizcocho bañado en tres leches con canela.', 20.00, 'dulce,postre', TRUE),
(8, 'Croissant de mantequilla', 'Hojaldre horneado cada mañana.', 12.00, 'dulce,horneado', TRUE),
(8, 'Alfajor de maicena', 'Relleno de dulce de leche y coco.', 8.00, 'dulce', TRUE),
(8, 'Galletas de avena', 'Paquete de tres galletas con pasas.', 10.00, 'dulce,horneado', TRUE),
(8, 'Brownie con nueces', 'Brownie denso con nueces del norte amazónico.', 16.00, 'dulce,chocolate', TRUE),
(8, 'Pie de limón', 'Base crocante, crema de limón y merengue.', 20.00, 'dulce,acido,postre', TRUE),
(8, 'Rollo de canela', 'Masa suave con canela y glaseado.', 15.00, 'dulce,horneado', FALSE);

INSERT INTO opciones_cafe (tipo, nombre, precio_extra) VALUES
('tamano', 'Pequeño (8 oz)', 0.00),
('tamano', 'Mediano (12 oz)', 4.00),
('tamano', 'Grande (16 oz)', 7.00),
('base', 'Espresso', 12.00),
('base', 'Doble espresso', 15.00),
('base', 'Cold brew', 18.00),
('base', 'Filtrado de origen', 16.00),
('leche', 'Sin leche', 0.00),
('leche', 'Leche entera', 2.00),
('leche', 'Leche deslactosada', 3.00),
('leche', 'Leche de almendra', 5.00),
('leche', 'Leche de avena', 5.00),
('extra', 'Shot extra', 4.00),
('extra', 'Jarabe de vainilla', 3.00),
('extra', 'Jarabe de caramelo', 3.00),
('extra', 'Jarabe de avellana', 3.00),
('extra', 'Crema batida', 3.00),
('extra', 'Canela', 0.00),
('extra', 'Cacao en polvo', 0.00),
('extra', 'Hielo', 0.00),
('endulzante', 'Sin azúcar', 0.00),
('endulzante', 'Azúcar', 0.00),
('endulzante', 'Chancaca', 1.00),
('endulzante', 'Stevia', 0.00),
('endulzante', 'Miel', 2.00);

INSERT INTO galeria (titulo, imagen) VALUES
('Nuestra barra', '/media/img/galeria/barra.jpg'),
('El salón principal', '/media/img/galeria/salon.jpg'),
('Tostado de la semana', '/media/img/galeria/granos.jpg'),
('Latte art', '/media/img/galeria/latte-art.jpg'),
('Rincón de lectura', '/media/img/galeria/rincon.jpg'),
('Nuestro equipo', '/media/img/galeria/equipo.jpg'),
('La terraza', '/media/img/galeria/terraza.jpg'),
('Vista desde el altillo', '/media/img/galeria/vista-alta.jpg'),
('La vitrina', '/media/img/galeria/vitrina.jpg'),
('Granos de origen', '/media/img/galeria/origen.jpg');

INSERT INTO pedidos (codigo, cliente, modalidad, estado, total) VALUES
('SC-1001', 'Ana', 'mesa', 'entregado', 44.00),
('SC-1002', 'Carlos', 'llevar', 'listo', 22.00),
('SC-1003', 'Lucía', 'delivery', 'preparando', 60.00);

INSERT INTO pedido_items (pedido_id, producto_id, producto, cantidad, precio_unitario, detalle) VALUES
(1, 8, 'Cappuccino', 2, 18.00, NULL),
(1, 52, 'Cuñapé', 2, 4.00, NULL),
(2, 22, 'Cold brew', 1, 22.00, NULL),
(3, 43, 'Desayuno americano', 1, 38.00, NULL),
(3, 12, 'Mocha', 1, 22.00, 'Sin crema');

INSERT INTO reservas (codigo, nombre, telefono, fecha, hora, personas) VALUES
('R-2001', 'Familia Rojas', '+591 70000001', '2026-11-20', '10:00:00', 4),
('R-2002', 'Grupo de estudio', NULL, '2026-11-21', '16:30:00', 6);
