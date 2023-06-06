import { defineStore } from 'pinia';
import { useFetchCsrf } from '~/composables/useFetchCsrf';
import { ICHECK_STATUS } from '~/types/auth';
import { IUserProfile } from '~/types/user';

interface ILoginPayload {
  email: string;
  password: string;
  confirmPassword?: string;
  name?: string;
}
interface IRegisterPayload {
  email: string;
  name: string;
  genderId: number;
  bloodTypeId: number;
  password: string;
  confirmPassword: string;
}
interface IAuthStoreState {
  user: IUserProfile | null | undefined;
  checkStatus: ICHECK_STATUS | null | undefined;
  errors: IErrors[] | null | undefined;
}
// cookies names
const csrf_cookie = "XSRF-TOKEN";

export const useAuthStore = defineStore('AuthStore', {
  state: (): IAuthStoreState => ({
    user: null,
    checkStatus: null,
    errors: null
  }),
  actions: {
    setUser(_user: IUserProfile | null | undefined) {
      console.log("useAuth: setUser: _user", _user);
      this.user = _user;
    },
    setCheckStatus(_checkStatus: ICHECK_STATUS | null | undefined) {
      this.checkStatus = _checkStatus;
    },
    setErrors(_errors: IErrors[] | null | undefined) {
      this.errors = _errors;
    },
    async loginUser({ email, password }: ILoginPayload) {
      let csrf = useCookie(csrf_cookie);
      switch (this.checkStatus) {
        case ICHECK_STATUS.VALID:
          break;
        case ICHECK_STATUS.CSRF_MISMATCH:
          csrf.value = null; // clear the token cookie 
          await callClearCookieServer();
        case ICHECK_STATUS.NOT_APPROVED:
          // incase user wants to register another account
          csrf.value = null;
          await callClearCookieServer();
        default:
          // else if UNAUTHENTICATED || CSRF_MISMATCH continue
          this.errors = null;
          await useFetchCsrf(this.checkStatus, 'login', {
            method: 'POST',
            body: {
              email,
              password,
            },
          }).then((res) => {
            console.log("useAuth: res", res);
            this.checkStatus = ICHECK_STATUS.VALID;
            this.errors = null;
            return;
          }).catch((apiErrors) => {
            if(apiErrors.response._data.message === 'Inactive'){
                this.checkStatus = ICHECK_STATUS.NOT_APPROVED;
                this.errors = [{
                    field: 'Inactive',
                    fieldErrors: ["Post-Check: Your Account hasn't been approved yet, please contact Admin, Come back later and refresh the page."],
                }];
                console.log("useAuth: apiErrors.response._data.user", apiErrors.response._data.user);
                this.user = apiErrors.response._data.user;
                return;
            }
            console.log("useAuth: apiErrors", apiErrors.response._data);
            console.log("useAuth: apiErrors", apiErrors.response._data.errors);
            if(apiErrors.response._data.errors) {
              const errorsArray = objectToArray(apiErrors.response._data.errors, "field", "fieldErrors");
              this.errors = errorsArray;
              console.log("useAuth: array", errorsArray);
              return;
            }
          });
          break;
      }
      if (this.checkStatus === ICHECK_STATUS.VALID) {
        const userProfile = await getCurrentUserProfile(this.checkStatus);
        console.log("useAuth: userProfile", userProfile);
        this.user = userProfile;
      }
    },
    async registerUser({ email, name, genderId, bloodTypeId, password, confirmPassword }: IRegisterPayload) {
      let csrf = useCookie(csrf_cookie);
      switch (this.checkStatus) {
        case ICHECK_STATUS.VALID:         
          break;
        case ICHECK_STATUS.CSRF_MISMATCH:
          csrf.value = null; // clear the token cookie
          await callClearCookieServer();
        case ICHECK_STATUS.NOT_APPROVED:
          // incase user wants to register another account
          csrf.value = null;
          await callClearCookieServer();
        default:
          // else if UNAUTHENTICATED || CSRF_MISMATCH continue
          this.errors = null;
          await useFetchCsrf(this.checkStatus, 'register', {
            method: 'POST',
            body: {
              email,
              name,
              genderId,
              bloodTypeId,
              password,
              password_confirmation: confirmPassword
            },
          }).then((res) => {
            console.log("useAuth: res", res);
            this.checkStatus = ICHECK_STATUS.NOT_APPROVED;
            this.errors = [{
              field: 'Inactive',
              fieldErrors: ["Post-Check: Your Account hasn't been approved yet, please contact Admin, Come back later and refresh the page."],
            }];
            return;
          }).catch((apiErrors) => {
            console.log("useAuth: apiErrors", apiErrors.response._data);
            console.log("useAuth: apiErrors", apiErrors.response._data.errors);
            if(apiErrors.response._data.errors) {
              const errorsArray = objectToArray(apiErrors.response._data.errors, "field", "fieldErrors");
              this.errors = errorsArray;
              console.log("useAuth: array", errorsArray);
              return;
            }
          });
          break;
      }
      sendEmailVerification(this.checkStatus);
    },
    async logUserOut() {
      let csrf = useCookie(csrf_cookie);
      switch (this.checkStatus) {
        case ICHECK_STATUS.NOT_APPROVED:
          break;
        case ICHECK_STATUS.UNAUTHENTICATED:        
          break;
        case ICHECK_STATUS.CSRF_MISMATCH:
          csrf.value = null; // clear the token cookie  
          await callClearCookieServer();
        default:
          // else if UNAUTHENTICATED || CSRF_MISMATCH continue
          await useFetchCsrf(this.checkStatus, 'logout', {
            method: 'POST',
            body: {
              email: this.user && this.user.email,
            },
          }).then((res) => {
            console.log("useAuth: log out successful", res);
            this.checkStatus = ICHECK_STATUS.UNAUTHENTICATED;
            this.errors = [{
                field: 'Unauthenticated',
                fieldErrors: ['Post-Check: Please login.'],
            }];  
            return;
          }).catch((apiErrors) => {
            console.log("useAuth: apiErrors", apiErrors.response_data);
          });
          // TODO: maybe move them inside then scope
          csrf.value = null; // clear the token cookie
          await callClearCookieServer();
          this.user = null;
      }
    },
  },
});