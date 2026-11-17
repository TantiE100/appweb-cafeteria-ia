# Santi's Coffee

AppWeb de una cafetería con frontend en Angular, backend en Node.js (Express), base de datos MySQL y un agente conversacional con Ollama y gemma3 que usa herramientas sobre la base de datos.

> Dulce como Santi, café como Lucho.

## Estructura

```
database/   schema.sql y seed.sql de MySQL
backend/    API Express: models, controllers, middleware, routes, chatbot, app.js
frontend/   Angular 22 + Tailwind: inicio, servicios, especialidades, nosotros, precios, contactos y chat
```

## Requisitos

- Docker
- Node.js 24 (solo para compilar el frontend)

Ollama corre en Docker (servicio `ollama`) y el servicio `ollama-modelo` descarga `gemma3:1b` al primer arranque. Los modelos quedan en `~/.ollama`.

## Levantar todo

```
cd frontend && npm install && npx ng build && cd ..
docker compose up -d --build
```

- Web: http://localhost:4200
- API: http://localhost:3000/api

MySQL se crea y se llena solo al primer arranque con `database/schema.sql` y `database/seed.sql`.

Para usar Ollama nativo en vez del contenedor (aprovecha la GPU en Mac): `OLLAMA_URL=http://host.docker.internal:11434 docker compose up -d --build mysql backend frontend`.

## Desarrollo local

```
docker compose up -d mysql
cd backend && cp .env.example .env && npm install && npm run dev
cd frontend && npm install && npx ng serve
```

El frontend en http://localhost:4200 usa `proxy.conf.json` para llegar a la API.

## Base de datos

| Tabla | Uso |
|---|---|
| cafeteria | Datos del hero, nosotros, contacto y footer |
| servicios | Servicios de la cafetería |
| especialidades | Especialidades de la casa |
| categorias, productos | Carta y precios |
| galeria | Fotos de la tienda |
| contactos | Mensajes del formulario y del chat |
| agente | Persona y reglas del agente |
| textos, navegacion, sugerencias_chat | Todo el texto de la interfaz |
| carritos, carrito_items | Carrito por sesión |
| opciones_cafe | Tamaños, bases, leches, extras y endulzantes para armar un café |
| pedidos, pedido_items | Pedidos creados desde el chat |
| reservas | Reservas de mesa creadas desde el chat |

## API

| Método | Ruta | Descripción |
|---|---|---|
| GET | /api/cafeteria | Información general |
| GET | /api/nosotros | Información y galería |
| GET | /api/galeria | Fotos de la tienda |
| GET | /api/servicios | Servicios |
| GET | /api/especialidades | Especialidades |
| GET | /api/precios | Carta agrupada por categoría |
| POST | /api/contactos | Formulario de contacto |
| GET | /api/sitio | Textos, navegación, sugerencias y datos del agente |
| GET | /api/menu | Carta paginada por categoría |
| GET, DELETE | /api/carrito | Ver o vaciar el carrito |
| POST, PATCH, DELETE | /api/carrito/items | Agregar, cambiar o quitar ítems |
| POST | /api/carrito/checkout | Pago simulado y creación del pedido |
| POST | /api/chat | Agente Lucho |

## Agente Lucho

La persona, las reglas y el contexto del negocio salen de MySQL (tablas `agente`, `cafeteria`, `categorias`, `servicios`, `especialidades`). Cada dato concreto se obtiene con herramientas definidas por módulo en `backend/src/chatbot/herramientas/`, cada una con su JSON Schema:

| Módulo | Herramientas |
|---|---|
| negocio | `info_cafeteria`, `ver_servicios`, `ver_especialidades` |
| menu | `ver_producto`, `ver_menu` (paginado), `buscar_productos`, `ver_opciones_cafe` |
| carrito | `ver_carrito`, `agregar_al_carrito`, `armar_cafe`, `quitar_del_carrito`, `vaciar_carrito`, `iniciar_checkout` |
| pedidos | `confirmar_pedido`, `ver_pedido`, `cancelar_pedido` |
| reservas | `reservar_mesa`, `ver_reserva` |
| contacto | `dejar_mensaje` |

El modelo es gemma3 en Ollama. Como gemma3 no soporta tool calling nativo en Ollama, el backend le envía el catálogo de herramientas por módulo y le exige responder con un JSON validado por JSON Schema (`format` de Ollama) que indica la herramienta y sus argumentos. El backend ejecuta la herramienta contra MySQL, le devuelve el resultado y repite hasta 3 pasos.

Cada resultado vuelve al frontend como `acciones` y se muestra como tarjeta según su tipo: menú paginado, productos, especialidades, servicios, información, opciones de café, carrito, checkout, pedido o reserva.

## Carrito y checkout

El carrito vive en MySQL por sesión (header `X-Sesion`). El checkout es simulado: tarjeta, QR o efectivo; las tarjetas que terminan en `0000` se rechazan para probar el error.

## Créditos

Video y fotos de [Pexels](https://www.pexels.com/).
