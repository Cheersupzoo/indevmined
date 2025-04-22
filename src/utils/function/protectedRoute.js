import { jwtVerify, createRemoteJWKSet } from 'jose'
import { getHeader } from './index'

const jwks_uri =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'

/**
 * @param {(context: Context, tokenPayload: import('jose').JWTPayload) => Promise<Response>} onRequest
 */
export const protectedRoute = (onRequest) => {
  return async (context) => {
    const headers = getHeader(context)
    const authorization = context.request.headers.get('authorization')
    if (!authorization) {
      return Response.json(
        { status: 'unauthorized', message: 'missing authorization header' },
        { status: 401, headers }
      )
    }
    if (!authorization.startsWith('Bearer ')) {
      return Response.json(
        { status: 'unauthorized', message: 'Unsupported token type' },
        { status: 401, headers }
      )
    }
    const token = authorization.replace(/^Bearer /, '')
    const JWKS = createRemoteJWKSet(new URL(jwks_uri))
    const { payload } = await jwtVerify(token, JWKS, {
      algorithms: ['RS256'],
      issuer: 'https://securetoken.google.com/indevmined',
      audience: 'indevmined'
    })
    if (payload.email !== 'cheersupzoo@gmail.com') {
      return Response.json(
        { status: 'unauthorized', message: 'Unauthorized user' },
        { status: 401, headers }
      )
    }

    return onRequest(context, payload)
  }
}
