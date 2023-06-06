import { ICHECK_STATUS } from "~/types/auth"
import { IUserProfile } from "~/types/user";

// "sending email verification" or "clicking the link in email" will not work if session is not valid,
// before calling user should be authenticated in the laravel context not neccessarly in frontend.
// so we can call this endpoint:
// after login call,but we don't want to send it everytime user login
// or user can click on verifyEmailButton in authenticated pages,
// or after register call, since he is authenticated in laravel context(P.S. he is not approved then 403 Forbidden, but the email will be sent anyway)
// conclusion: call it after register not after login
// P.S. if verification link in email expired user can click on verifyEmailButton
export const sendEmailVerification = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IUserProfile> => {
    const res = await useFetchCsrf(checkStatus, 'email/verification-notification', {
        method: 'POST',
    });
    console.log('sendEmailVerification: res', res)
    return res; // data in response expected be empty string "" if "sending" is successful
}