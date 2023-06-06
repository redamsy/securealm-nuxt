import { ICHECK_STATUS } from "~/types/auth"
import { IUserProfile } from "~/types/user";

export const getCurrentUserProfile = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IUserProfile> => {
    try {
        const res = await useFetchCsrf(checkStatus, 'api/self', {
            method: 'GET',
        });
        console.log('getCurrentUserProfile: res.user', res.user)
        return res.user;
    } catch (error) {
        throw `getCurrentUserProfile: error ${error}`;
    }
}