import { Request, Response } from 'express';
import { addStudentService, getStudentService, getStudentByIdService, updateStudentService, deleteStudent } from '../service/studentService';
// import { Student } from '../exportInterfaces/studentInterface';

export const addStudentController = async (req: Request, res: Response): Promise<void> => {
    console.log('Inside addStudentController');
    try {
        const { name, parentId } = req.body;
        if (!name || !parentId) {
            
            console.log('Validation failed');
            res.status(400).json({ success: false, message: 'Name and Parent ID are required' });
            return;
        }
        console.log('Calling addStudentService');
        const response = await addStudentService(name, parentId);

        console.log('Student added:', response);
        res.status(201).json({ message: 'Student added successfully', data: response });
    } catch (error) {
        console.error('Error in addStudentController:', error);
        res.status(500).json({ success: false, message: 'Cannot add Student', error: (error as Error).message });
    }
};

export const getStudentsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getStudentService();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};

export const getStudentByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const response = await getStudentByIdService(id);
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};

export const updateStudentController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        if (!name || isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid ID and Name are required' });
            return;
        }
        const response = await updateStudentService(id, name);
        res.status(200).json({ message: 'Student updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};


export const deleteStudentController = async(req: Request, res: Response): Promise<void>=>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({error: `Id is required`});
            return;
        }
        const response = await deleteStudent(Number(id));
        if(!response){
            res.status(404).json({message: `id not found or delete failed`});
        }
        res.status(200).json({message: `Student id: ${id} deleted successfully`})
    } catch (error) {
        console.error(`error in deleting student and related child data: (controller)`,(error as Error).message);
        res.status(500).json({ message: 'Cannot delete Student', error: (error as Error).message });
    }
};

