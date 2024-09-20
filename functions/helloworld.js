export const onRequest = async (context) => {
  const text = `Hello, world! ${process.env.test}`

  return new Response(text)
}
