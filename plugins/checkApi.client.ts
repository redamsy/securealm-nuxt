export default defineNuxtPlugin(async (nuxtApp) => {
    console.log('checkApi plugin');

    const csrf_cookie = "XSRF-TOKEN";
    let csrf = useCookie(csrf_cookie);
    console.log('appCreated csrf', csrf.value)

    const { setCheckStatus, setErrors, setUser } = useAuthStore();
    // const piniaStore = nuxtApp.store.useStore();
    setCheckStatus(null);
    setErrors(null);
    setUser(null);

    if (csrf.value) {
        const { checkStatus, errors, user } = await checkLaravelApi();
        setCheckStatus(checkStatus);
        setErrors(errors);
        setUser(user);
    }
})
// these scenario is tested with postman:

// 1st scenario: Not Authenticated
// If you are not authenticated and you send a request to "sanctum/csrf-cookie" to get the CSRF token
// and then use it to login successfully, you cannot use the same token to perform actions like logout
// or login again. This is because Sanctum generates a new CSRF token upon successful authentication.

// After successful authentication, you should retrieve the new CSRF token from the response headers
// and update the "X-XSRF-TOKEN" header in your subsequent requests with the new token.
// Attempting to use the old token for actions like 
// logout or login again will result in a "CSRF token mismatch" error.

// 2nd scenario: Already Authenticated
// If you are already authenticated and you send a request to "sanctum/csrf-cookie" to get the CSRF token
// and then use it to perform actions like logout or login again, you can use the same token.

// Since you are already authenticated, the CSRF token remains the same for subsequent requests.
// You can use the retrieved token from "sanctum/csrf-cookie" for actions like 
// logout or login again without encountering a "CSRF token mismatch" error.

// However, it's important to note that if you log out and then log in again,
// a new CSRF token will be generated for the subsequent authentication request.
// Therefore, you should retrieve the new CSRF token after logging in again
// and update the "X-XSRF-TOKEN" header for further requests.

// In summary, when using Sanctum, it's crucial to retrieve and update the CSRF token accordingly
// based on the authentication state and ensure that you are using the correct token for each request
// to prevent "CSRF token mismatch" errors.