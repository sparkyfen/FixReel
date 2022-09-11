import { Router } from 'itty-router';

import { Constants } from './constants';
import { Strings } from './strings';
import { sanitizeText } from './helpers/utils';

const router = Router();

const versionRequest = async (request: Request) => {
  return new Response(Strings.VERSION_HTML.format({
    rtt: request.cf?.clientTcpRtt ? `🏓 ${request.cf.clientTcpRtt} ms RTT` : '',
    colo: request.cf?.colo || '??',
    httpversion: request.cf?.httpProtocol || 'Unknown HTTP Version',
    tlsversion: request.cf?.tlsVersion || 'Unknown TLS Version',
    ip: request.headers.get('x-real-ip') || request.headers.get('cf-connecting-ip') || 'Unknown IP',
    city: request.cf?.city || 'Unknown City',
    region: request.cf?.region || request.cf?.country || 'Unknown Region',
    country: request.cf?.country || 'Unknown Country',
    asn: `AS${request.cf?.asn || '??'} (${request.cf?.asOrganization || 'Unknown ASN'})`,
    ua: sanitizeText(request.headers.get('user-agent') || 'Unknown User Agent'),
  }), {
    headers: {
      ...Constants.RESPONSE_HEADERS,
      'cache-control': 'max-age=1'
    },
    status: 200
  });
};

router.get('/version', versionRequest);


/* If we don't understand the route structure at all, we'll
   redirect to GitHub (normal domains) or API docs (api.fxtwitter.com) */
router.get('*', async (request: Request) => {
  const url = new URL(request.url);

  return Response.redirect(Constants.REDIRECT_URL, 302);
});

export const cacheWrapper = async (
	request: Request,
  event?: FetchEvent
): Promise<Response> => {
	const userAgent = request.headers.get('User-Agent') || '';
  // https://developers.cloudflare.com/workers/examples/cache-api/
  const cacheUrl = new URL(
    userAgent.includes('Telegram')
      ? `${request.url}&telegram`
      : request.url
  );
  console.log(`Hello from ⛅ ${request.cf?.colo || 'UNK'}`)
  console.log('userAgent', userAgent);
  console.log('cacheUrl', cacheUrl);

  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = caches.default;

  switch (request.method) {
  	case 'GET':
      if (!Constants.API_HOST_LIST.includes(cacheUrl.hostname)) {
        /* cache may be undefined in tests */
        const cachedResponse = await cache.match(cacheKey);

        if (cachedResponse) {
          console.log('Cache hit');
          return cachedResponse;
        }

        console.log('Cache miss');
      }

      /* Literally do not know what the hell eslint is complaining about */
      // eslint-disable-next-line no-case-declarations
      const response = await router.handle(request, event);

      /* Store the fetched response as cacheKey
         Use waitUntil so you can return the response without blocking on
         writing to cache */
      try {
        event && event.waitUntil(cache.put(cacheKey, response.clone()));
      } catch (error) {
        console.error((error as Error).stack);
      }
      return response;
    /* Telegram sends this from Webpage Bot, and Cloudflare sends it if we purge cache, and we respect it.
       PURGE is not defined in an RFC, but other servers like Nginx apparently use it. */
    case 'PURGE':
      console.log('Purging cache as requested');
      await cache.delete(cacheKey);
      return new Response('', { status: 200 });
    /* yes, we do give HEAD */
    case 'HEAD':
      return new Response('', {
        headers: Constants.RESPONSE_HEADERS,
        status: 200
      });
    /* We properly state our OPTIONS when asked */
    case 'OPTIONS':
      return new Response('', {
        headers: {
          allow: Constants.RESPONSE_HEADERS.allow
        },
        status: 204
      });
    default:
      return new Response('', { status: 405 });
  }
}

/* Event to receive web requests on Cloudflare Worker */
addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    (async (): Promise<Response> => {
      try {
        return await cacheWrapper(event.request, event);
      } catch (err: unknown) {
        /* workaround for silly TypeScript things */
        const error = err as Error;
        console.error(error.stack);

        return new Response(Strings.ERROR_HTML, {
          headers: {
            ...Constants.RESPONSE_HEADERS,
            'content-type': 'text/html',
            'cache-control': 'max-age=1'
          },
          status: 500
        });
      }
    })()
  );
});