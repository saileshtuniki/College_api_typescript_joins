import { insertStudent, fetchStudent, fetchStudentById, updateStudent, deleteAllStudentById } from '../repository/studentRepository';
import { Student, StudentResponse } from '../exportInterfaces/studentInterface';

export const addStudentService = async (name: string, parentId: number) => {
    try {
        if (!name || !parentId) {
            throw new Error('Name and Parent ID are required');
        }
        return await insertStudent(name, parentId);
    } catch (error) {
        console.error('Error adding student:', (error as Error).message);
        throw new Error('Failed to add student');
    }
};

export const getStudentService = async (): Promise<Student[]> => {
    try {
        return await fetchStudent();
    } catch (error) {
        console.error('Error fetching students:', (error as Error).message);
        throw new Error('Failed to fetch students');
    }
};

export const getStudentByIdService = async (id: number): Promise<Student> => {
    try {
        if (!id) throw new Error('ID is required');
        return await fetchStudentById(id);
    } catch (error) {
        console.error('Error fetching student by ID:', (error as Error).message);
        throw new Error('Failed to fetch student by ID');
    }
};

export const updateStudentService = async (id: number, name: string): Promise<StudentResponse> => {
    try {
        if (!id || !name) throw new Error('ID and Name are required');
        return await updateStudent(id, name);
    } catch (error) {
        console.error('Error updating student:', (error as Error).message);
        throw new Error('Failed to update student');
    }
};

export const deleteStudent = async(id: number): Promise<boolean>=>{
    try {
        if(!id){
            throw new Error(`Student ID is required`);
        }
        const result = await deleteAllStudentById(id);
        if(!result){
            throw new Error(`No matching ID found to delete (service)`);
        }
        return result;
    } catch (error) {
        throw new Error(`Error in deleting data of Student ${(error as Error).message}`);
    }
}

// export const deleteStudentService = async (id: number): Promise<{ message: string }> => {
//     try {
//         if (!id) throw new Error('ID is required');
//         return await removeStudent(id);
//     } catch (error) {
//         console.error('Error deleting student:', (error as Error).message);
//         throw new Error('Failed to delete student');
//     }
// };
