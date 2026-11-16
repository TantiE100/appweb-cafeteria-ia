const REQUEST_TIMEOUT_MS = 90000;

function errorConCodigo(mensaje, code) {
  return Object.assign(new Error(mensaje), { code });
}

async function enviar(url, opciones, nombre) {
  let response;
  try {
    response = await fetch(url, { ...opciones, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  } catch (err) {
    throw errorConCodigo(`No se pudo conectar con ${nombre}: ${err.message}`, 'OLLAMA_NO_DISPONIBLE');
  }
  if (!response.ok) {
    const detalle = await response.text();
    throw errorConCodigo(`${nombre} respondió ${response.status}: ${detalle.slice(0, 300)}`, 'OLLAMA_ERROR');
  }
  return response.json();
}

async function llamarOllama(messages, esquema) {
  const data = await enviar(
    `${process.env.OLLAMA_URL}/api/chat`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'gemma3:1b',
        stream: false,
        format: esquema,
        options: { temperature: 0.2, num_predict: 400 },
        messages
      })
    },
    'Ollama'
  );
  return data.message?.content?.trim() ?? '';
}

function alternar(messages) {
  const resultado = [];
  for (const { role, content } of messages) {
    const ultimo = resultado.at(-1);
    if (ultimo && ultimo.role === role) ultimo.content += `\n\n${content}`;
    else resultado.push({ role, content });
  }
  if (resultado[0]?.role === 'assistant') resultado.unshift({ role: 'user', content: 'Hola' });
  return resultado;
}

async function llamarAnthropic(messages, esquema) {
  const sistema = messages.filter((m) => m.role === 'system').map((m) => m.content).join('\n\n');
  const instruccion = esquema ? '\n\nDevuelve únicamente el objeto JSON, sin texto adicional ni bloques de código.' : '';
  const data = await enviar(
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
        max_tokens: 800,
        system: sistema + instruccion,
        messages: alternar(messages.filter((m) => m.role !== 'system'))
      })
    },
    'Anthropic'
  );
  return (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('').trim();
}

export function nombreProveedor() {
  return process.env.LLM_PROVIDER === 'anthropic' ? 'anthropic' : 'ollama';
}

export function llamarModelo(messages, esquema) {
  return nombreProveedor() === 'anthropic' ? llamarAnthropic(messages, esquema) : llamarOllama(messages, esquema);
}
