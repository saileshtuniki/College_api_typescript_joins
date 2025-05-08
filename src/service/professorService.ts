import { insertProfessor, fetchProfessor, fetchProfessorById, updateProfessor, fetchAllProfById, deleteAllProfessorById } from '../repository/professorRepository';
import { Professor, ProfessorResponse } from '../exportInterfaces/professorInterface';

export const addProfessor = async (name: string, parentId: number) => {
    try {
        if (!name || !parentId) {
            throw new Error('Name and Parent ID are required');
        }
        return await insertProfessor(name, parentId);
    } catch (error) {
        console.error('Error adding professor:', (error as Error).message);
        throw new Error('Failed to add professor');
    }
};

export const getProfessor = async (): Promise<Professor[]> => {
    try {
        return await fetchProfessor();
    } catch (error) {
        console.error('Error fetching professors:', (error as Error).message);
        throw new Error('Failed to fetch professors');
    }
};

export const getProfessorById = async (id: number): Promise<Professor> => {
    try {
        if (!id) throw new Error('ID is required');
        return await fetchProfessorById(id);
    } catch (error) {
        console.error('Error fetching professor by ID:', (error as Error).message);
        throw new Error('Failed to fetch professor by ID');
    }
};

export const serviceUpdateProfessor = async (id: number, name: string): Promise<ProfessorResponse> => {
    try {
        if (!id || !name) throw new Error('ID and Name are required');
        return await updateProfessor(id, name);
    } catch (error) {
        console.error('Error updating professor:', (error as Error).message);
        throw new Error('Failed to update professor');
    }
};

export const getAllProfById = async(id: number): Promise<Professor | null> =>{
    try {
        if(!id){
            throw new Error('Id is required');
        }
        const result =  await fetchAllProfById(id);
        if(!result){
            throw new Error(`Professor not Found`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in fetching Professor:${(error as Error).message}`);
    }
}

export const deleteProfessor = async(id: number): Promise<boolean>=>{
    try {
        if(!id){
            throw new Error('Professor ID is required');
        }
        const result = await deleteAllProfessorById(id);
        if(!result){
            throw new Error(`No matching ID found to delete (service)`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in deleting data from professor and related child data(service), ${(error as Error).message}`);
    }
}

// export const addProfessor = async (name: string, parentId: number): Promise<Professor> => {
//     if (!name || !parentId) {
//         throw new Error('Name and Parent ID are required');
//     }
//     return await insertProfessor(name, parentId);
// };

// export const getProfessor = async (): Promise<Professor[]> => {
//     return await fetchProfessor();
// };

// export const getProfessorById = async (id: number): Promise<Professor> => {
//     if (!id) throw new Error('ID is required');
//     return await fetchProfessorById(id);
// };

// export const serviceUpdateProfessor = async (id: number, name: string): Promise<{ message: string }> => {
//     if (!id || !name) throw new Error('ID and Name are required');
//     return await updateProfessor(id, name);
// };

// export const deleteProfessor = async (id: number): Promise<{ message: string }> => {
//     if (!id) throw new Error('ID is required');
//     return await removeProfessor(id);
// };

// export const getAllProfById = async (id: number): Promise<Professor | null> => {
//     if (!id) throw new Error('ID is required');
//     return await fetchAllProfById(id);
// };
