/**
 *
 * @param {string} message
 * @param {WritableStream} writableStream
 */
export async function sendMessage(message, writableStream) {
  const defaultWriter = writableStream.getWriter()
  const encoder = new TextEncoder()
  const encoded = encoder.encode('data: ' + message + '\n\n')
  await defaultWriter.ready
  await defaultWriter.write(encoded)
  defaultWriter.releaseLock()
}
