export const onRequest = async (context) => {
  const text = `Hello, world! ${context.env.test}`

  return new Response(text)
}
