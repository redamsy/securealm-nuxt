import { ICHECK_STATUS } from "~/types/auth"
import { IUSER_TYPE, IUserProfile } from "~/types/user";

export const setUserTypeAndApproval = async (
    checkStatus: ICHECK_STATUS | null | undefined,
    id: number,
    userType: IUSER_TYPE,
    isApproved: boolean,
): Promise<IUserProfile> => {
    try {
        const res = await useFetchCsrf(checkStatus, `api/setUserTypeAndApproval/${id}`, {
            method: 'POST',
            body: {
                userType,
                isApproved,
            },
        });
        console.log('setUserTypeAndApproval: res', res)
        return res.data;        
    } catch (error) {
        throw `setUserTypeAndApproval: error ${error}`;        
    }
}