import { obtenerCafeteria } from '../models/cafeteria.model.js';
import { obtenerAgente } from '../models/sitio.model.js';
import { listarCategorias } from '../models/producto.model.js';
import { listarServicios } from '../models/servicio.model.js';
import { listarEspecialidades } from '../models/especialidad.model.js';
import { HERRAMIENTAS, catalogoTexto } from './herramientas/index.js';
import { llamarOllama } from './ollama.js';

const MAX_PASOS = 6;

function hoy() {
  const zona = { timeZone: 'America/La_Paz' };
  const largo = new Intl.DateTimeFormat('es-BO', { ...zona, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
  const iso = new Intl.DateTimeFormat('en-CA', zona).format(new Date());
  return `${largo} (${iso})`;
}

async function promptSistema() {
  const [agente, cafeteria, categorias, servicios, especialidades] = await Promise.all([
    obtenerAgente(),
    obtenerCafeteria(),
    listarCategorias(),
    listarServicios(),
    listarEspecialidades()
  ]);
  return `${agente.personalidad}
Tu nombre es ${agente.nombre} (${agente.rol}) de ${cafeteria.nombre}, ${cafeteria.ciudad}. Eslogan: "${cafeteria.eslogan}".

Contexto del negocio:
- Dirección: ${cafeteria.direccion}. Horario: ${cafeteria.horario}.
- Categorías de la carta: ${categorias.join(', ')}.
- Servicios: ${servicios.map((s) => s.nombre).join(', ')}.
- Especialidades: ${especialidades.map((e) => e.nombre).join(', ')}.
- Hoy es ${hoy()}.

Reglas:
${agente.reglas}`;
}

function registrar(nombre, args, resultado) {
  console.log(`[agente] ${nombre} ${JSON.stringify(args)} ${resultado.error ? `-> ${resultado.error}` : '-> ok'}`);
}

async function ejecutar(nombre, args, contexto, acciones) {
  const herramienta = HERRAMIENTAS[nombre];
  if (!herramienta) return { error: `La herramienta ${nombre} no existe.` };
  let resultado;
  try {
    resultado = await herramienta.ejecutar(args ?? {}, contexto);
  } catch (err) {
    console.error(err);
    resultado = { error: 'La herramienta falló. Discúlpate y sugiere intentarlo de nuevo.' };
  }
  registrar(nombre, args, resultado);
  const vacio = Array.isArray(resultado.datos) && !resultado.datos.length;
  if (resultado.tipo && resultado.datos && !vacio) {
    acciones.length = 0;
    acciones.push({ herramienta: nombre, tipo: resultado.tipo, datos: resultado.datos });
  }
  return resultado;
}

function textoResultado(resultado) {
  return resultado.error ? `ERROR: ${resultado.error}` : resultado.resumen ?? 'OK';
}

function normalizarHistorial(historial, mensaje) {
  const mensajes = [];
  for (const m of [...historial, { role: 'user', content: mensaje }]) {
    if (!m.content) continue;
    const ultimo = mensajes.at(-1);
    if (ultimo?.role === m.role) ultimo.content += `\n\n${m.content}`;
    else mensajes.push({ role: m.role, content: m.content });
  }
  while (mensajes[0]?.role === 'assistant') mensajes.shift();
  return mensajes;
}

const ESQUEMA_OLLAMA = {
  type: 'object',
  properties: {
    herramienta: { type: 'string', enum: [...Object.keys(HERRAMIENTAS), 'responder'] },
    argumentos: { type: 'object' },
    respuesta: { type: 'string' }
  },
  required: ['herramienta', 'argumentos', 'respuesta']
};

function leerDecision(contenido) {
  try {
    const inicio = contenido.indexOf('{');
    const json = JSON.parse(contenido.slice(inicio, contenido.lastIndexOf('}') + 1));
    return { herramienta: json.herramienta, argumentos: json.argumentos ?? {}, respuesta: String(json.respuesta ?? '').trim() };
  } catch {
    return { herramienta: 'responder', argumentos: {}, respuesta: contenido };
  }
}

async function conOllama(system, mensajes, contexto) {
  const messages = [
    { role: 'system', content: `${system}\n\nHerramientas por módulo:\n${catalogoTexto()}\n\nResponde SIEMPRE con JSON {"herramienta": "<nombre o responder>", "argumentos": {...}, "respuesta": "<texto si herramienta es responder>"}.` },
    ...mensajes
  ];
  const acciones = [];
  const usadas = new Set();
  for (let paso = 0; paso < 3; paso++) {
    const decision = leerDecision(await llamarOllama(messages, ESQUEMA_OLLAMA));
    const firma = `${decision.herramienta}:${JSON.stringify(decision.argumentos)}`;
    if (!HERRAMIENTAS[decision.herramienta] || usadas.has(firma)) {
      return { respuesta: decision.respuesta || 'Listo. ¿Te ayudo con algo más?', acciones };
    }
    usadas.add(firma);
    const resultado = await ejecutar(decision.herramienta, decision.argumentos, contexto, acciones);
    messages.push({ role: 'assistant', content: JSON.stringify({ herramienta: decision.herramienta, argumentos: decision.argumentos, respuesta: '' }) });
    messages.push({ role: 'user', content: `Resultado de ${decision.herramienta}: ${textoResultado(resultado)}\nAhora responde al cliente con "herramienta": "responder", salvo que necesites otra herramienta.` });
  }
  const final = await llamarOllama([...messages, { role: 'user', content: 'Responde al cliente en 1 a 3 oraciones, texto plano.' }]);
  return { respuesta: final || 'Listo. ¿Te ayudo con algo más?', acciones };
}

export async function responderChat(mensaje, historial, sesion) {
  const system = await promptSistema();
  const mensajes = normalizarHistorial(historial, mensaje);
  const contexto = { sesion };
  const resultado = await conOllama(system, mensajes, contexto);
  return { respuesta: resultado.respuesta || 'Listo. ¿Te ayudo con algo más?', acciones: resultado.acciones };
}
