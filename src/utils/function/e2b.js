import { ApiClient } from 'e2b'

const getHost = (port, sandboxId, domain) => {
  return `${port}-${sandboxId}.${domain}`
}

/**
 * @param {string} code
 * @param {string} e2bApiKey
 */
export const callE2B = async (e2bApiKey, id, code) => {
  try {
    const config = {
      apiKey: e2bApiKey,
      apiUrl: 'https://api.e2b.dev',
      debug: false
    }
    const apiClient = new ApiClient(config)
    const createRes = await apiClient.api.POST('/sandboxes', {
      body: {
        templateID: 'code-interpreter-v1',
        timeout: 10
      }
    })
    const host = getHost(
      49999,
      `${createRes.data.sandboxID}-${createRes.data.clientID}`,
      'e2b.dev'
    )

    const resExecute = await fetch(`https://${host}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code
        // context_id: opts?.context?.id,
        // language: opts?.language,
        // env_vars: opts?.envs,
      }),
      // signal: controller.signal,
      keepalive: true
    })

    const stdout = []
    const stderr = []

    try {
      for await (const chunk of readLines(resExecute.body)) {
        const parsed = JSON.parse(chunk)
        switch (parsed.type) {
          case 'stdout':
            stdout.push(parsed.text)
            break
          case 'stderr':
            stderr.push(parsed.text)
            break

          default:
            break
        }
      }
    } catch (error) {
      throw error
    } finally {
      await apiClient.api.DELETE(`/sandboxes/${createRes.data?.sandboxID}`)
    }

    return {
      id,
      result: stdout.join('\n'),
      error: stderr.length ? stderr.join('\n') : undefined
    }
  } catch (error) {
    console.trace(error)
    console.error(error)

    return {
      id,
      error: error?.message
    }
  }
}

async function* readLines(stream) {
  const reader = stream.getReader()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()

      if (value !== undefined) {
        buffer += new TextDecoder().decode(value)
      }

      if (done) {
        if (buffer.length > 0) {
          yield buffer
        }
        break
      }

      let newlineIdx = -1

      do {
        newlineIdx = buffer.indexOf('\n')
        if (newlineIdx !== -1) {
          yield buffer.slice(0, newlineIdx)
          buffer = buffer.slice(newlineIdx + 1)
        }
      } while (newlineIdx !== -1)
    }
  } finally {
    reader.releaseLock()
  }
}
