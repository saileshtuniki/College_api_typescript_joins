import { Request, Response } from 'express';
import { addProfessor, getProfessor, getProfessorById, serviceUpdateProfessor, getAllProfById, deleteProfessor} from '../service/professorService';

import { Professor, ProfessorResponse } from '../exportInterfaces/professorInterface';

export const addProfessorController = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, parentId } = req.body;
        if (!name || !parentId) {
            res.status(400).json({ success: false, message: 'Name and Parent ID are required' });
            return;
        }
        const response = await addProfessor(name, parentId);
        res.status(201).json({ 
            message: 'Professor added successfully',
            data: response });
            return;
    } catch (error) {
        res.status(500).json({ success: false, message: 'Cannot add Professor', error: (error as Error).message });
    }
};

export const getProfessorsController = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await getProfessor();
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({
             message: 'Server Error', 
             error: (error as Error).message 
            });
    }
};

export const getProfessorByIdController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const response = await getProfessorById(id);
        if(!response){
            res.status(404).json({error: `Professor with ${id} not found (controller)`});
        }
        res.status(200).json({data: response});
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};

export const updateProfessorController = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        if (!name || isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid ID and Name are required' });
            return;
        }
        const response = await serviceUpdateProfessor(id, name);
        res.status(200).json({ message: 'Professor updated successfully', data: response });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
};

export const getAllProfByIdController = async(req: Request, res: Response): Promise<void> =>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({message: `Id is required`})
        }
        const response = await getAllProfById(Number(id));
        res.status(200).json({message: `Professor data fetched successfully`, data: response});
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: (error as Error).message });
    }
}

export const deleteProfessorController = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({error: `Id is required`});
            return;
        }
        const response = await deleteProfessor(Number(id));
        if(!response){
            res.status(404).json({error: `id not found or delete failed`});
        } 
        res.status(200).json({ message: `Professor ID ${id} deleted successfully` });
    } catch (error) {
        console.error(`error in deleting Professor and related child data: (controller)`,(error as Error).message);
        res.status(500).json({ message: 'Cannot delete Professor', error: (error as Error).message });
    }
};
