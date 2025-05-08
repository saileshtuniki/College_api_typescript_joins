
import {insertPrincipal, fetchPrincipal, fetchprincipalById, updatePrincipal as updatePrincipalRepository, fetchAllById, deleteAllById} from '../repository/principalRepository';
import {Principal, UpdateResponse} from '../exportInterfaces/principalInterface'

export const addPrincipal  = async (name: string) =>{
    try {
        if(!name){
            throw new Error(`Name is required`);
        }
        const result = await insertPrincipal(name);
        return result;
    } catch (error) {
        throw new Error(`Error in adding Principal: ${(error as Error).message}`);
    }
};


export const getPrincipal = async() =>{
    try {
        const result = await fetchPrincipal();
        return result;
    } catch (error) {
        throw new Error(`Error in getting principal: ${(error as Error).message}`)
    }
}

export const getPrincipalById = async(id: number): Promise<Principal | null> => {
    try {
        if(!id){
            throw new Error(`Id is required`);
        }
        return await fetchprincipalById(id);
        
    } catch (error) {
        throw new Error(`Error in fetching principal by Id: ${(error as Error).message}`)
    }
}


export const serviceupdatePrincipal = async(id: number, name: string): Promise<UpdateResponse> =>{
    try {
        if (!id || !name) {
            throw new Error('ID and Name are required');
        }

        const result = await updatePrincipalRepository(id, name);
        if(!result){
            throw new Error('Principal not found or update has failed');
        }
        return result;
    } catch (error) {
        throw new Error(`Error updating principal: ${(error as Error).message}`);
    }
}


export const getAllByIdService = async(id: number): Promise<Principal | null> =>{
    try {
        if(!id){
            throw new Error('ID is required');
        }
        const result = await fetchAllById(id);
        if(!result){
            throw new Error(`Data not found (Service)`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in fetching data from principal: ${(error as Error).message}`);
    }
}

export const deletePrincipal = async(id: number): Promise<boolean> =>{
    try {
        if(!id){
            throw new Error('ID is required');
        }
        const result = await deleteAllById(id);
        if(!result){
            throw new Error(`No matching ID found to delete (Service)`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in deleteing data from principal and child (service): ${(error as Error).message}`);
    }
}

