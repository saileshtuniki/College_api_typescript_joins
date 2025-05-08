import { Request, Response } from "express";
// import {Principal} from '../exportInterfaces/principalInterface'
import {addPrincipal, getPrincipal, getPrincipalById, serviceupdatePrincipal, getAllByIdService, deletePrincipal} from '../service/principalService';


export const addPrincipalController = async (req: Request, res: Response): Promise<void>=>{
    try {
        const {name} = req.body;
        if(!name){
            console.log("Validation failed : Name is missing");
            
            res.status(400).json({message: `Name is not Provided`});
            return;
        }
        const response = await addPrincipal(name);
        console.log("Principal added successfully", response);
        
        res.status(200).json({
            success:  true,
            message: 'Principal added successfully',
            data: response,
        })
    } catch (error) {
        console.error(`Error in adding principal (POST request)`, (error as Error).message);
        res.status(500).json({
            success: false,
            message: 'Error in adding principal',
            error: (error as Error).message
        })
    }
}


export const getPrincipalController = async(req: Request, res: Response):Promise<void>=>{
    try {
        const response = await getPrincipal();
        res.status(200).json({
            message: 'Principal fetched successfully', 
            data: response
        });
    } catch (error) {
        // console.error(`Error in getting pricipal`,(error as Error).message);
        res.status(500).json({
            success: false,
            message: 'Error in getting principal'
        });
    }
}

export const getPrincipalByIdController = async(req: Request, res:Response): Promise<void>=>{
    try {
        const id: number = parseInt(req.params.id, 10);

        if(isNaN(id)){
            res.status(400).json({message: `Invalid Id format`});
            return;
        }
        const response = await getPrincipalById(id);
        if (!response) {
            res.status(404).json({ error: 'Principal with id not found' });
            return;
        }
        res.status(200).json({success: true, messsage: `Principal of id: % ${id}`, data: response})
    } catch (error) {
        console.error(`Error in getting pricipal`,(error as Error).message);
        res.status(500).json({
            success: false,
            message: 'Error in getting principal'
        });
    }
}



export const updatePrinicpalController = async(req:Request, res: Response): Promise<void> =>{
    try {
        const {id} = req.params;
        const {name} = req.body;

        if(!id || !name){
             res.status(400).json({error: `Id and name are required`});
             return;
        }
        // Log the values to ensure they're being passed correctly
        // console.log(`Updating principal with id: ${id}, name: ${name}`);

        const response = await serviceupdatePrincipal (Number(id), name);
        if(!response){
            res.status(404).json({error: `principal not found or update failed`});
            return;
        }
        res.status(200).json({message: `Principal updated successfully`, data: response});
    } catch (error) {
        console.error(`error in updating principal:`, (error as Error).message);
        res.status(500).json({message: `Error while updating principal`, error: (error as Error).message})
    }
}


export const getAllByIdController = async(req: Request, res: Response):Promise<void>=>{
    try {
        const {id} = req.params;
        const numericId  = Number(id);

        if(!id || isNaN(numericId) || !Number.isInteger(numericId) || numericId <=0){
              res.status(400).json({error: `Id is required and must be a positive integer`});
              return;
        }
        const response = await getAllByIdService(Number(id));
        if(!response){
            res.status(404).json({error: `Id not found or Fetching failed`});
            return;
        }
        res.status(200).json({message: `Principal and child data fetched succuessfully`, data: response});
    } catch (error) {
        console.error(`error in fetching principal and child data:`,(error as Error).message);
        res.status(500).json({message: `Error while updating principal`, error: (error as Error).message});
        
    }
}

export const deletePrincipalController = async(req:Request, res: Response):Promise<void>=>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({error: `Id is required`});
            return;
        }
        const response = await deletePrincipal(Number(id));
        if(!response){
            res.status(404).json({error: `Id not found or delete failed`});
            return;
        }
        res.status(200).json({message: `Principal and child data deleted succuessfully`});
        // res.status(200).json({message: `Principal and child data deleted succuessfully`, data: response});
    } catch (error) {
        console.error(`error in deleting principal and child data: (controller)`,(error as Error).message);
        res.status(500).json({message: `Error while deleting principal`, error: (error as Error).message});
    }
}


