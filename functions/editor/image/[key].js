import { getHeader, onRequestOptions } from '../../../src/utils/function/index'
import { protectedRoute } from '../../../src/utils/function/protectedRoute'

export { onRequestOptions }

/**
 * @typedef { { INDEVMINED_BUCKET: import('@cloudflare/workers-types').R2Bucket, CDN_URL: string } } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */

/**
 * Handles DELETE requests to delete an image from R2.
 * @param {Context} context
 * @returns {Promise<Response>}
 */
export const onRequestDelete = protectedRoute(
  /**
   * @param {Context} context
   * @param {import('jose').JWTPayload & {email: string}} tokenPayload
   */
  async (context, tokenPayload) => {
    const headers = getHeader(context)
    try {
      const key = context.params['key']
      const objectKey = decodeURIComponent(key)
      if (!objectKey) {
        return Response.json(
          {
            status: 'failed',
            error: 'No key provided.'
          },
          { status: 400, headers }
        )
      }

      if (!objectKey.startsWith('image/')) {
        return Response.json(
          {
            status: 'failed',
            error: 'Invalid key.'
          },
          { status: 400, headers }
        )
      }

      await context.env.INDEVMINED_BUCKET.delete(objectKey)

      return new Response(null, { headers, status: 204 })
    } catch (error) {
      console.error('Image delete error:', error)
      return Response.json(
        { status: 'failed', error: 'Failed to delete image from CDN.' },
        { status: 500, headers }
      )
    }
  }
)
