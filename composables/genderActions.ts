import { ICHECK_STATUS } from "~/types/auth";
import { IGender } from "~/types/gender";

const getGendersList = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IGender[]> => {
    try {
        const res = await useFetchCsrf(checkStatus, 'api/genders', {
            method: 'GET',
        });
        console.log('genderAction: getGendersList: res.data', res.data)
        return res.data;        
    } catch (error) {
        throw `genderAction: getGendersList: error ${error}`;        
    }
}
export {
    getGendersList,
}