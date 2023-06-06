export const callClearCookieServer = async () => {
    return useFetch('/api/clearCookie', {
        method: 'post',
        body: {
          cookieName: ""
        }
    });
}