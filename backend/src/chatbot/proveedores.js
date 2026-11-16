const REQUEST_TIMEOUT_MS = 90000;

function errorConCodigo(mensaje, code) {
  return Object.assign(new Error(mensaje), { code });
}

async function enviar(url, opciones, nombre) {
  let response;
  try {
    response = await fetch(url, { ...opciones, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (err) {
    throw errorConCodigo(`No se pudo conectar con ${nombre}: ${err.message}`, 'LLM_NO_DISPONIBLE');
  }
  if (!response.ok) {
    const detalle = await response.text();
    throw errorConCodigo(`${nombre} respondió ${response.status}: ${detalle.slice(0, 300)}`, 'LLM_ERROR');
  }
  return response.json();
}

export function proveedor() {
  return process.env.LLM_PROVIDER === 'anthropic' ? 'anthropic' : 'ollama';
}

export function llamarAnthropic({ system, messages, tools }) {
  return enviar(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
        max_tokens: 1024,
        system,
        tools,
        messages
      })
    },
    'Anthropic'
  );
}

export async function llamarOllama(messages, format) {
  const data = await enviar(
    `${process.env.OLLAMA_URL}/api/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'gemma3:1b',
        stream: false,
        format,
        options: { temperature: 0.2, num_predict: 400 },
        messages
      })
    },
    'Ollama'
  );
  return data.message?.content?.trim() ?? '';
}
