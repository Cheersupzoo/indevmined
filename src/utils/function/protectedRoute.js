import {
  jwtVerify,
  createRemoteJWKSet,
  importJWK,
  decodeProtectedHeader
} from 'jose'
import { getHeader } from './index'

const jwks_uri =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'

/**
 * @typedef { {GROQ_API_KEY: string, E2B_API_KEY: string, TOGETHER_AI_API_KEY: string, TIP_TAP_APP_SECRET: string} } Env
 * @typedef { import('@cloudflare/workers-types').EventContext<Env, '',{}> } Context
 */
/**
 * @param {(context: Context, tokenPayload: import('jose').JWTPayload & {email: string}) => Promise<Response>} onRequest
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
    try {
      const { kid, alg } = decodeProtectedHeader(token)
      console.log('kid, alg', kid, alg)

      const pubListReq = await fetch(new URL(jwks_uri))
      const pubList = await pubListReq.json()
      const jwk = pubList.keys.find((key) => key.kid === kid)
      const JWK = await importJWK(jwk, alg)
      const { payload } = await jwtVerify(token, JWK, {
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
    } catch (e) {
      console.error(e)
      console.error('jwks', JWKS.jwks())

      return Response.json(
        { status: 'unauthorized', message: 'Invalid token' },
        { status: 401, headers }
      )
    }
  }
}
