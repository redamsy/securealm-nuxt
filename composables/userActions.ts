import { ICHECK_STATUS } from "~/types/auth";
import { IUserProfile, IEditUserForm } from "~/types/user";

const updateUserProfileInformation = async (checkStatus: ICHECK_STATUS | null | undefined, data: IEditUserForm): Promise<string> => {
    try {
        const res = await useFetchCsrf(checkStatus, `user/profile-information`, {
            method: 'PUT',
            body: {
                name: data.name,
                email: data.email,
                genderId: data.genderId,
                bloodTypeId: data.bloodTypeId,
            }
        });
        console.log('updateUserProfileInformation: res.data', res)
        return res;        
    } catch (error) {
        throw `updateUserProfileInformation: error ${error}`;
    }
}
export {
    updateUserProfileInformation,
}