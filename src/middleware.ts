import { json } from '@solidjs/router'
import { createMiddleware } from '@solidjs/start/middleware'

const TRUSTED_ORIGINS = ['https://learning.ecam.be', 'https://mozilla.github.io']

export default createMiddleware({
  onBeforeResponse: ({ request, response }) => {
    response.headers.append('Vary', 'Origin, Access-Control-Request-Method')
    const origin = request.headers.get('Origin')
    const requestUrl = new URL(request.url)
    const pdf = requestUrl.pathname.toLowerCase().endsWith('.pdf')

    if (pdf && origin && TRUSTED_ORIGINS.includes(origin)) {
      if (request.method === 'OPTIONS' && request.headers.get('Access-Control-Request-Method')) {
        return json(null, {
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          },
        })
      }

      response.headers.set('Access-Control-Allow-Origin', origin)
    }
  },
})
