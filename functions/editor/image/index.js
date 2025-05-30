import { getHeader, onRequestOptions } from '../../../src/utils/function/index'
import { protectedRoute } from '../../../src/utils/function/protectedRoute'

export { onRequestOptions }

/**
 * @typedef { { INDEVMINED_BUCKET: import('@cloudflare/workers-types').R2Bucket, CDN_URL: string } } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */

/**
 * Handles POST requests to upload an image to R2.
 * @param {Context} context
 * @returns {Promise<Response>}
 */
export const onRequestPost = protectedRoute(
  /**
   * @param {Context} context
   * @param {import('jose').JWTPayload & {email: string}} tokenPayload
   */
  async (context, tokenPayload) => {
    const headers = getHeader(context)
    try {
      if (!context.env.CDN_URL) {
        throw new Error('CDN_URL not found')
      }
      const formData = await context.request.formData()
      const imageFile = formData.get('image')

      if (!imageFile || !(imageFile instanceof File)) {
        return Response.json(
          {
            status: 'failed',
            error: 'No image file uploaded or invalid format.'
          },
          { status: 400, headers }
        )
      }

      console.log('imageFile', imageFile)
      const imageType = imageFile.type.split('/')[1]

      const objectKey = `image/${Date.now()}-${crypto.randomUUID()}.${imageType}`

      // Upload to R2
      const uploadedObject = await context.env.INDEVMINED_BUCKET.put(
        objectKey,
        await imageFile.arrayBuffer(),
        {
          httpMetadata: {
            contentType: imageFile.type
          }
          // You might want to add custom metadata, e.g., uploader email
          // customMetadata: {
          //   uploader: tokenPayload.email,
          // },
        }
      )

      if (!uploadedObject) {
        throw new Error('Failed to upload image to CDN.')
      }

      // Consider returning the full URL if your bucket is public or you have a custom domain
      // For now, returning the key.
      return Response.json(
        {
          status: 'success',
          url: `${context.env.CDN_URL}/${uploadedObject.key}`
        },
        { headers }
      )
    } catch (error) {
      console.error('Image upload error:', error)

      return Response.json(
        { status: 'failed', error: 'Failed to process image upload.' },
        { status: 500, headers }
      )
    }
  }
)
