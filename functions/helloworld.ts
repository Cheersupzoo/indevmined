import { type PagesFunction, Response } from '@cloudflare/workers-types'

export const onRequest: PagesFunction<{}> = async (context) => {
  return new Response('Hello, world!')
}
