import { ICHECK_STATUS } from "~/types/auth"
import { IUserProfile } from "~/types/user";

export const getUsersList = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IUserProfile[]> => {
    try {
        const res = await useFetchCsrf(checkStatus, 'api/users', {
            method: 'GET',
        });
        console.log('getUsersList: res', res)
        return res.data;        
    } catch (error) {
        throw `getUsersList: error ${error}`;        
    }
}