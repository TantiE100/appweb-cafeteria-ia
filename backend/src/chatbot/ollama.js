const REQUEST_TIMEOUT_MS = 120000;

function errorConCodigo(mensaje, code) {
  return Object.assign(new Error(mensaje), { code });
}

export async function llamarOllama(messages, format) {
  let response;
  try {
    response = await fetch(`${process.env.OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      body: JSON.stringify({
        model: process.env.OLLAMA_MODEL || 'gemma3:1b',
        stream: false,
        format,
        options: { temperature: 0.1, num_predict: 400 },
        messages
      })
    });
  } catch (err) {
    throw errorConCodigo(`No se pudo conectar con Ollama: ${err.message}`, 'LLM_NO_DISPONIBLE');
  }
  if (!response.ok) {
    const detalle = await response.text();
    throw errorConCodigo(`Ollama respondió ${response.status}: ${detalle.slice(0, 300)}`, 'LLM_ERROR');
  }
  const data = await response.json();
  return data.message?.content?.trim() ?? '';
}
