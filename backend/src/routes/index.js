import { Router } from 'express';
import { getCafeteria, getNosotros, getGaleria } from '../controllers/cafeteria.controller.js';
import { getServicios } from '../controllers/servicios.controller.js';
import { getEspecialidades } from '../controllers/especialidades.controller.js';
import { getPrecios } from '../controllers/precios.controller.js';
import { postContacto } from '../controllers/contactos.controller.js';
import { postChat } from '../controllers/chat.controller.js';
import { validarContacto } from '../middleware/validarContacto.js';
import { validarChat } from '../middleware/validarChat.js';

export const router = Router();

router.get('/cafeteria', getCafeteria);
router.get('/nosotros', getNosotros);
router.get('/galeria', getGaleria);
router.get('/servicios', getServicios);
router.get('/especialidades', getEspecialidades);
router.get('/precios', getPrecios);
router.post('/contactos', validarContacto, postContacto);
router.post('/chat', validarChat, postChat);
