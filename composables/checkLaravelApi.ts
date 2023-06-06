import { ICHECK_STATUS } from "~/types/auth";
import { IUserProfile } from "~/types/user";

export const checkLaravelApi = async () => {
    // const laravel_session_cookie = "laravel_session";
    // let session = useCookie(laravel_session_cookie);
    const csrf_cookie = "XSRF-TOKEN";
    const csrf = useCookie(csrf_cookie);
    console.log('checkLaravelApi csrf', csrf.value)
    //check if cookies exist
    if (!csrf.value) { throw 'checkLaravelApi: "XSRF-TOKEN" cookie not found in browser';}

    const checkStatus: globalThis.Ref<ICHECK_STATUS|null|undefined> = ref(null);
    const errors: globalThis.Ref<IErrors[]|null|undefined> = ref(null);
    const user: globalThis.Ref<IUserProfile|null|undefined> = ref(null);

    const headers: HeadersInit = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    
        // only needed if proxied cookies are required in SSR
        // cookie: useRequestHeaders(['cookie'])?.cookie,
    
        // if we have a token, set 'x-xsrf-token' header
        "X-XSRF-TOKEN": csrf.value,
    };
    // send request to laravel to validate cookies (post 'isRequestValid')
    await $fetch('api/isRequestValid', {
        method: "POST",
        credentials: 'include',// this is necessary, so that Cookie attribute is set automatically in the headers of the request
        baseURL: 'http://localhost/',
        headers,
    }).then((res: any) =>{
        //res should be true
        console.log('checkLaravelApi: res', res);
        if (res.isRequestValid) {
            checkStatus.value = ICHECK_STATUS.VALID;
            errors.value = null;
            user.value = res.user;
            return;
        } else throw 'checkLaravelApi: res.isRequestValid maybe undefined'
    }).catch((error) => {
        console.log('checkLaravelApi: error.response._data', error.response._data);
        //res should be either 'not_upproved' or 'csrf_mismatch'or 'unauthenticated'
        if(error.response._data.message === 'CSRF token mismatch.'){
            checkStatus.value = ICHECK_STATUS.CSRF_MISMATCH;
            errors.value = [{
                field: 'Csrf_mismatch',
                fieldErrors: ["Pre-Check: CSRF token mismatch, if you can't login please contact Admin."],
            }];    
            return;
        }
        if(error.response._data.message === 'Unauthenticated.'){
            checkStatus.value = ICHECK_STATUS.UNAUTHENTICATED;
            errors.value = [{
                field: 'Unauthenticated',
                fieldErrors: ['Pre-Check: Please login.'],
            }];    
            return;       
        }
        if(error.response._data.message === 'Inactive'){
            checkStatus.value = ICHECK_STATUS.NOT_APPROVED;
            errors.value = [{
                field: 'Inactive',
                fieldErrors: ["Pre-Check: Your Account hasn't been approved yet, please contact Admin, Come back later and refresh the page."],
            }];
            user.value = error.response._data.user;
            return;
        }
        throw 'checkLaravelApi: Unexpected error occured';
    });
    return {
        checkStatus: checkStatus.value,
        errors: errors.value,
        user: user.value,
    };
}
