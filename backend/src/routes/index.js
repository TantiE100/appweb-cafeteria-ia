import { Router } from 'express';
import { getSitio } from '../controllers/sitio.controller.js';
import { getCafeteria, getNosotros, getGaleria } from '../controllers/cafeteria.controller.js';
import { getServicios } from '../controllers/servicios.controller.js';
import { getEspecialidades } from '../controllers/especialidades.controller.js';
import { getPrecios, getMenu } from '../controllers/precios.controller.js';
import { postContacto } from '../controllers/contactos.controller.js';
import { getCarrito, postItem, patchItem, deleteItem, deleteCarrito, postCheckout } from '../controllers/carrito.controller.js';
import { postChat } from '../controllers/chat.controller.js';
import { validarContacto } from '../middleware/validarContacto.js';
import { validarChat } from '../middleware/validarChat.js';
import { requerirSesion } from '../middleware/sesion.js';

export const router = Router();

router.get('/sitio', getSitio);
router.get('/cafeteria', getCafeteria);
router.get('/nosotros', getNosotros);
router.get('/galeria', getGaleria);
router.get('/servicios', getServicios);
router.get('/especialidades', getEspecialidades);
router.get('/precios', getPrecios);
router.get('/menu', getMenu);
router.post('/contactos', validarContacto, postContacto);

router.get('/carrito', requerirSesion, getCarrito);
router.delete('/carrito', requerirSesion, deleteCarrito);
router.post('/carrito/items', requerirSesion, postItem);
router.patch('/carrito/items/:id', requerirSesion, patchItem);
router.delete('/carrito/items/:id', requerirSesion, deleteItem);
router.post('/carrito/checkout', requerirSesion, postCheckout);

router.post('/chat', requerirSesion, validarChat, postChat);
