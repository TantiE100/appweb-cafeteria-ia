import { obtenerCafeteria } from '../models/cafeteria.model.js';
import { listarCategorias } from '../models/producto.model.js';
import { HERRAMIENTAS, catalogoHerramientas } from './herramientas.js';
import { llamarModelo } from './proveedores.js';

const MAX_PASOS = 3;

function fechaHoy() {
  return new Intl.DateTimeFormat('es-BO', {
    timeZone: 'America/La_Paz',
    weekday: 'long',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function fechaIso() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/La_Paz' }).format(new Date());
}

async function promptSistema() {
  const [cafeteria, categorias] = await Promise.all([obtenerCafeteria(), listarCategorias()]);
  return `Eres Lucho, el barista virtual de ${cafeteria.nombre} en ${cafeteria.direccion}. Eslogan: "${cafeteria.eslogan}".
Hoy es ${fechaHoy()} (${fechaIso()}). Horario: ${cafeteria.horario}.
Categorías de la carta: ${categorias.join(', ')}.

Tienes estas herramientas, que leen y escriben en la base de datos real de la cafetería:
${catalogoHerramientas()}

Reglas:
- Si el cliente pide ver, buscar, pedir, armar, consultar, cancelar o reservar algo, USA la herramienta adecuada en vez de inventar.
- Nunca inventes productos, precios, códigos ni estados: salen solo de las herramientas.
- Si a una herramienta le falta un dato obligatorio, responde pidiendo ese dato.
- Cuando ya tengas el resultado de la herramienta, responde con "herramienta": "responder".
- Respuestas en español, cálidas, en 1 a 3 oraciones, en texto plano sin markdown. Los precios en Bs.
- Si piden algo ajeno a la cafetería, redirige amablemente.

Responde SIEMPRE con un JSON: {"herramienta": "<nombre o responder>", "argumentos": {...}, "respuesta": "<texto para el cliente si herramienta es responder>"}`;
}

const ESQUEMA = {
  type: 'object',
  properties: {
    herramienta: { type: 'string', enum: [...Object.keys(HERRAMIENTAS), 'responder'] },
    argumentos: { type: 'object' },
    respuesta: { type: 'string' }
  },
  required: ['herramienta', 'argumentos', 'respuesta']
};

function extraerJson(contenido) {
  const inicio = contenido.indexOf('{');
  const fin = contenido.lastIndexOf('}');
  return inicio >= 0 && fin > inicio ? contenido.slice(inicio, fin + 1) : contenido;
}

function leerDecision(contenido) {
  try {
    const json = JSON.parse(extraerJson(contenido));
    return {
      herramienta: json.herramienta,
      argumentos: json.argumentos && typeof json.argumentos === 'object' ? json.argumentos : {},
      respuesta: typeof json.respuesta === 'string' ? json.respuesta.trim() : ''
    };
  } catch {
    return { herramienta: 'responder', argumentos: {}, respuesta: contenido };
  }
}

async function redactarFinal(messages) {
  const texto = await llamarModelo([
    ...messages,
    { role: 'user', content: 'Con los resultados anteriores, responde al cliente en español, en 1 a 3 oraciones, texto plano.' }
  ]);
  return texto || 'Listo, aquí tienes la información.';
}

export async function responderChat(mensaje, historial) {
  const messages = [{ role: 'system', content: await promptSistema() }, ...historial, { role: 'user', content: mensaje }];
  const acciones = [];
  const usadas = new Set();

  for (let paso = 0; paso < MAX_PASOS; paso++) {
    const decision = leerDecision(await llamarModelo(messages, ESQUEMA));
    const herramienta = HERRAMIENTAS[decision.herramienta];
    const firma = `${decision.herramienta}:${JSON.stringify(decision.argumentos)}`;

    if (!herramienta || usadas.has(firma)) {
      const respuesta = decision.respuesta || (acciones.length ? await redactarFinal(messages) : '');
      return { respuesta: respuesta || 'Perdona, no te entendí. ¿Me lo dices de otra forma?', acciones };
    }

    usadas.add(firma);
    let resultado;
    try {
      resultado = await herramienta.ejecutar(decision.argumentos);
    } catch (err) {
      console.error(err);
      resultado = { error: 'La herramienta falló. Discúlpate y sugiere intentarlo de nuevo.' };
    }
    console.log(`[agente] ${decision.herramienta}`, JSON.stringify(decision.argumentos), resultado.error ? `-> ${resultado.error}` : '-> ok');

    if (resultado.tipo && resultado.datos && !(Array.isArray(resultado.datos) && !resultado.datos.length)) {
      acciones.push({ herramienta: decision.herramienta, tipo: resultado.tipo, datos: resultado.datos });
    }
    messages.push({ role: 'assistant', content: JSON.stringify({ herramienta: decision.herramienta, argumentos: decision.argumentos, respuesta: '' }) });
    messages.push({
      role: 'user',
      content: `Resultado de ${decision.herramienta}: ${resultado.error ? `ERROR: ${resultado.error}` : resultado.resumen}\nAhora responde al cliente con "herramienta": "responder", salvo que necesites otra herramienta.`
    });
  }

  return { respuesta: await redactarFinal(messages), acciones };
}
