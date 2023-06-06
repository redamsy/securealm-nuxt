import { useAuthStore } from '~/stores/useAuth';
import { ICHECK_STATUS } from '~/types/auth';
import { IUSER_TYPE } from '~/types/user';

//Named route middleware, which are placed in the middleware/ directory 
//and will be automatically loaded via asynchronous import when used on a page.
//(Note: The route middleware name is normalized to kebab-case, so someMiddleware becomes some-middleware.)
export default defineNuxtRouteMiddleware((to, from) => {
    const csrf_cookie = "XSRF-TOKEN";
    let csrf = useCookie(csrf_cookie);
    const store = useAuthStore();

    console.log('middleware/isAdmin: store.checkStatus', store.checkStatus)
    if (csrf.value && store.checkStatus === null) return;
    if (store.checkStatus !== ICHECK_STATUS.VALID || store.user?.userType !== IUSER_TYPE.ADMIN) return '/login';
});