const MAX_RETRIES = 5
const INITIAL_RETRY_DELAY = 1000 // 1 second

function waitForOnline(): Promise<void> {
  if (navigator.onLine) return Promise.resolve()

  return new Promise((resolve) => {
    const handleOnline = () => {
      window.removeEventListener('online', handleOnline)
      resolve()
    }
    window.addEventListener('online', handleOnline)
  })
}

export async function fetchAwareOnline(
  input: RequestInfo | URL,
  init?: RequestInit,
  retryCount = 0
): Promise<Response> {
  try {
    const response = await fetch(input, init)
    // Other client error will be handle on the caller
    // // If the response is not ok, throw an error to trigger retry logic
    // if (!response.ok) {
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // } a

    if (response.status >= 500 && response.status < 600) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response
  } catch (error) {
    // Only retry for network errors or 5xx server errors
    const isNetworkError =
      error instanceof TypeError &&
      (error.message === 'Failed to fetch' ||
        error.message.includes('Network request failed'))

    const isServerError =
      error instanceof Error &&
      error.message.startsWith('HTTP error! status: 5')

    if (retryCount >= MAX_RETRIES || (!isNetworkError && !isServerError)) {
      throw error
    }

    // Wait for network to be back online if we're offline
    if (!navigator.onLine) {
      await waitForOnline()
    }

    // Calculate exponential backoff delay with jitter
    const delay = Math.min(
      INITIAL_RETRY_DELAY * Math.pow(2, retryCount) + Math.random() * 1000, // example: 1000, 2000, 4000, 8000, 16000
      30000 // Max 30 seconds
    )

    // Wait for the calculated delay
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Retry the request
    return fetchAwareOnline(input, init, retryCount + 1)
  }
}
