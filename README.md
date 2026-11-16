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
- Ollama nativo (usa la GPU de la Mac) con el modelo `gemma3:1b`

```
brew install ollama
brew services start ollama
ollama pull gemma3:1b
```

## Levantar todo

```
cd frontend && npm install && npx ng build && cd ..
docker compose up -d --build
```

- Web: http://localhost:4200
- API: http://localhost:3000/api

MySQL se crea y se llena solo al primer arranque con `database/schema.sql` y `database/seed.sql`.

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
| POST | /api/chat | Agente Lucho |

## Agente Lucho

El backend envía a gemma3 el catálogo de herramientas y le pide responder en JSON con la herramienta a usar (`format` de Ollama con JSON Schema). El backend ejecuta la herramienta contra MySQL, le devuelve el resultado al modelo y repite hasta 3 pasos. El frontend muestra cada resultado como una tarjeta en el chat.

Herramientas: `ver_menu`, `buscar_productos`, `ver_especialidades`, `ver_servicios`, `info_cafeteria`, `ver_opciones_cafe`, `armar_cafe`, `crear_pedido`, `ver_pedido`, `cancelar_pedido`, `reservar_mesa`, `ver_reserva` y `dejar_mensaje`.

## Créditos

Video y fotos de [Pexels](https://www.pexels.com/).
