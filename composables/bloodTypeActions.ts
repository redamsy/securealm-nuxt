import { ICHECK_STATUS } from "~/types/auth";
import { IBloodType } from "~/types/bloodType";

const getBloodTypesList = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IBloodType[]> => {
    try {
        const res = await useFetchCsrf(checkStatus, 'api/bloodTypes', {
            method: 'GET',
        });
        console.log('bloodTypeAction: getBloodTypesList: res.data', res.data)
        return res.data;        
    } catch (error) {
        throw `bloodTypeAction: getBloodTypesList: error ${error}`;        
    }
}
export {
    getBloodTypesList,
}