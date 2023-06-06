import { ICHECK_STATUS } from "~/types/auth";

export const useFetchCsrf = async (checkStatus: ICHECK_STATUS | null | undefined, ...[url, opts]: Parameters<typeof $fetch>) => {
  // csrf token name
  const csrf_cookie = "XSRF-TOKEN";

  // check for 'XSRF-TOKEN' cookie
  let csrf = useCookie(csrf_cookie);
  console.log('useFetchCsrf: csrf.value', csrf.value)

  // check if existing token is valid
  if (csrf.value && checkStatus === ICHECK_STATUS.CSRF_MISMATCH) {
    throw `useFetchCsrf: CSRF_MISMATCH checkStatus===${checkStatus}`;
  }
  //TODO: check if token expired here and in checkLaravelApi

  //if 'XSRF-TOKEN' cookie isn't set, fetch and attempt to apply it
  if (!csrf.value) {
    let token: string|null|undefined = null;

    // if request is succesful, 'XSRF-TOKEN' cookie should be set
    const csrfRes = await $fetch.raw("sanctum/csrf-cookie", {
        credentials: 'include',
        baseURL: 'http://localhost/',
        headers: {
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
    });

    if (process.server) {
      // On server, extract the csrf from the response
      const cookies = csrfRes.headers.get("set-cookie");
      if(cookies) {
        token = cookies.split("XSRF-TOKEN=")[1].split(";")[0];
      } else {
        throw "'cookies' on server is null";
      }
    } else {
      // on client-side, the cookie should now be present in your browser
      // but nuxt isn't aware since the cookie was updated outside it's context
      // so we need to manually update our variable.
      token = useCookie(csrf_cookie)?.value;
      console.log('useFetchCsrf: token', token)
    }

    if (token) {
      // In SSR mode, this also sets the cookie on the client-side,
      // allowing it to be used for subsequent requests.
      csrf.value = token;
    }
  }

  const headers: HeadersInit = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    // if headers were provided, apply them
    ...(opts?.headers && opts.headers),

    // only needed if proxied cookies are required in SSR
    // cookie: useRequestHeaders(['cookie'])?.cookie,

    // if we have a token, set 'x-xsrf-token' header
    ...(csrf.value && { "X-XSRF-TOKEN": csrf.value }),
  };
  console.log('useFetchCsrf: headers', headers)

  return $fetch(url, {
    method: opts?.method,
    credentials: 'include',// this is necessary, so that Cookie attribute is set automatically in the headers of the request
    baseURL: 'http://localhost/',
    headers,
    body: opts?.body
  });
}
