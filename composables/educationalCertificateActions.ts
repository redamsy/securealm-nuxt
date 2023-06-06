import { ICHECK_STATUS } from "~/types/auth"
import { IEducationalCertificateIncludeUsers, IEducationalCertificate } from "~/types/educationalCertificate";
import { IUserProfile } from "~/types/user";

const getEducationalCertificatesList = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IEducationalCertificate[]> => {
    try {
        const res = await useFetchCsrf(checkStatus, 'api/educationalCertificates', {
            method: 'GET',
        });
        console.log('getEducationalCertificatesList: res.data', res.data)
        return res.data;        
    } catch (error) {
        throw `getEducationalCertificatesList: error ${error}`;        
    }
}
const createEducationalCertificate = async (checkStatus: ICHECK_STATUS | null | undefined, name: string): Promise<IEducationalCertificate> => {
    try {
        const res = await useFetchCsrf(checkStatus, `api/educationalCertificate`, {
            method: 'POST',
            body: {
                name,
            },
        });
        console.log('createEducationalCertificate: res.data', res.data)
        return res.data;        
    } catch (error) {
        throw `createEducationalCertificate: error ${error}`;        
    }
}
const updateEducationalCertificate = async (checkStatus: ICHECK_STATUS | null | undefined, data: IEducationalCertificate): Promise<IEducationalCertificate> => {
    try {
        const res = await useFetchCsrf(checkStatus, `api/educationalCertificate/${data.id}`, {
            method: 'PUT',
            body: {
                name: data.name,
            }
        });
        console.log('updateEducationalCertificate: res.data', res.data)
        return res.data;        
    } catch (error) {
        throw `updateEducationalCertificate: error ${error}`;
    }
}
const deleteEducationalCertificate = async (checkStatus: ICHECK_STATUS | null | undefined, id: number): Promise<void> => {
    try {
        const res = await useFetchCsrf(checkStatus, `api/educationalCertificate/${id}`, {
            method: 'DELETE',
        });
        console.log('deleteEducationalCertificate: res.data', res.data)
        return;        
    } catch (error) {
        throw `deleteEducationalCertificate: error ${error}`;        
    }
}
const getRuecsList = async (checkStatus: ICHECK_STATUS | null | undefined): Promise<IEducationalCertificateIncludeUsers[]> => {
    try {
        const res = await useFetchCsrf(checkStatus, 'api/ruecs/includeUsers=true', {
            method: 'GET',
        });
        console.log('getRuecsList: res.data', res.data)
        return res.data;        
    } catch (error) {
        throw `getRuecsList: error ${error}`;        
    }
}
const updateRuecBatch = async (checkStatus: ICHECK_STATUS | null | undefined, educationalCertificateIds: number[]): Promise<IUserProfile> => {
    try {
        const res = await useFetchCsrf(checkStatus, `api/ruec/batch`, {
            method: 'PUT',
            body: {
                educationalCertificateIds,
            }
        });
        console.log('updateRuecBatch: res.user', res.user)
        return res.user;        
    } catch (error) {
        throw `updateRuecBatch: error ${error}`;
    }
}
export {
    getEducationalCertificatesList,
    createEducationalCertificate,
    updateEducationalCertificate,
    deleteEducationalCertificate,
    getRuecsList,
    updateRuecBatch
}