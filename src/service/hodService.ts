
import {insertHod, fetchHod, fetchHodById, updateHodRepository, fetchAllHodById, deleteAllHodById} from '../repository/hodRepository';
import {Hod, HodResponse} from '../exportInterfaces/hodInterface'

const addHod = async (name: string, parentId: number) =>{
    try {
       if(!name || !parentId === undefined){
            throw new Error(`Name and parentId are required`);
       }
       const result = await insertHod(name, parentId);
       console.log(`Inserted Hod data`, result);
       return result;
    } catch (error) {
        console.error(`error in adding function:`, (error as Error).message);
        throw error; // this error will pass to controller
    }
}

const getHod = async():Promise<Hod[]> =>{
    try {
        // const result = await fetchHod();
        // return result;
        return await fetchHod();
    } catch (error) {
        throw new Error(`Fetching data of Hod has failed (service) ${(error as Error).message}`)
    }
}

const getHodById = async(id: number): Promise<Hod>=>{
    try {
        if(!id){
            throw new Error(`Id is required`);
        }
        return await fetchHodById(id);
    } catch (error) {
        throw new Error(`Error in fetching Hod by id: ${id}`);
    }
}

const ServiceUpdateHod = async(id: number, name: string): Promise<HodResponse>=>{
    try {
        if(!id || !name){
            throw new Error(`Id and name are required (service)`);
        }
        const result = await updateHodRepository(id, name);
        if(!result){
            throw new Error(`Hod not found or update has failed`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error updating Hod:${(error as Error).message}`);
    }
}

const getAllHodById = async(id: number): Promise<Hod | null> =>{
    try {
        if(!id){
            throw new Error(`Id is required (service)`);
        }
        const result = await fetchAllHodById(id);
        if(!result){
            throw new Error(`Hod not found or fetching has failed`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in fetching Hod:${(error as Error).message}`);
    }
}

const deleteHod = async(id: number): Promise<boolean> =>{
    try {
        if(!id){
            throw new Error('ID is required');
        }
        const result = await deleteAllHodById(id);
        if(!result){
            throw new Error(`No matching ID found to delete (Service)`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in deleteing data from Hod and related child data (service): ${(error as Error).message}`);
    }
}

export  {addHod, getHod, getHodById, ServiceUpdateHod, getAllHodById, deleteHod};

