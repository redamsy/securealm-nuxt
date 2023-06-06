import { useAuthStore } from '~/stores/useAuth';
import { ICHECK_STATUS } from '~/types/auth';

export default defineNuxtRouteMiddleware((to, from) => {
    const csrf_cookie = "XSRF-TOKEN";
    let csrf = useCookie(csrf_cookie);
    const store = useAuthStore();

    console.log('middleware/auth: store.checkStatus', store.checkStatus)
    if (csrf.value && store.checkStatus === null) return;
    if (store.checkStatus !== ICHECK_STATUS.VALID) return '/login';
});