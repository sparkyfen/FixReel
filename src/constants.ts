export const Constants = {
  API_HOST_LIST: API_HOST_LIST.split(','),
  /* These constants are populated by variables in .env, then set by Webpack */
  REDIRECT_URL: REDIRECT_URL,
  RESPONSE_HEADERS: {
    'allow': 'OPTIONS, GET, PURGE, HEAD',
    'content-type': 'text/html;charset=UTF-8',
    'x-powered-by': 'Foxes',
    'cache-control': 'max-age=3600' // Can be overriden in some cases
  },
};