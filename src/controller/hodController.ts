import {Request, Response} from 'express';

import {addHod, getHod, getHodById, ServiceUpdateHod, getAllHodById, deleteHod}  from '../service/hodService';

// getHod, getHodById, serviceUpdateHod
export const addHodController = async(req: Request, res: Response): Promise<void> =>{
    const {name, parentId} = req.body;

    try {
        if(!name || !parentId === undefined){
             res.status(400).json({
                success: false,
                message: `name and parent_id are required`
            });
            return;
        }
        const response = await addHod(name, parentId);
         res.status(201).json({
            message: `HOD added successfully`,
            data: response
        })
        return;
    } catch (error) {
        console.error(`error in adding Hod (controller)`, (error as Error).message);
        res.status(500).json({message:` Error while adding Hod`, error: (error as Error).message});
    }
};

export const getHodController = async(req: Request, res: Response):Promise<void> =>{
    try {
        const response = await getHod();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({
            message: 'Error in getting hod data (controller)',
            error: (error as Error).message
        });
    }
};

export const getHodByIdController = async(req: Request, res:Response): Promise<void> =>{
    try {
        const id: number = parseInt(req.params.id);
        if(isNaN(id)){
            res.status(400).json({message: `Invalid id format (controller)`});
            return;
        }
        const response = await getHodById(id);
        if(!response){
            res.status(404).json({error: `Hod with ${id} not found (controller)`});
        }
        res.status(200).json({success: true, message: `Hod of id: ${id}`, data: response})
    } catch (error) {
        console.error(`Error in getting hod`);
        res.status(500).json({
            success: false,
            message: (`Error in getting Hod (controller)`),
            error: (error as Error).message
        });
    }
}

export const updateHodController = async(req: Request, res:Response):Promise<void> =>{
    try {
        const {id} = req.params;
        const {name} = req.body;

        if(!id || !name){
            res.status(400).json({error: `Id and name are required`});
            return;
        }
        // Log the values to ensure they're being passed correctly
        console.log(`Updating hod with id: ${id}, name: ${name}`);

        const response = await ServiceUpdateHod(Number(id), name);
        if(!response){
            res.status(404).json({error: `Hod not found or update failed`});
            return;
        }
        res.status(200).json({message: `hod upadated successfully`, data: response});
    } catch (error) {
        console.error(`error in updating hod:`, (error as Error).message);
        res.status(500).json({message: `error while updating Hod`, error: (error as Error).message});
    }
}

export const getAllHodByIdController = async(req:Request, res:Response):Promise<void>=>{
    try {
    const {id} = req.params;
    if(!id){
        res.status(400).json({error: `Id is required`});
    }
    const response = await getAllHodById(Number(id));
    if(!response){
        res.status(404).json({error: `Hod not found or fetching failed`});
        return;
    }
    res.status(200).json({message: `data fetched successfully`, data: response});
    } catch (error) {
        console.error(`error in fetching hod and child elements:`, (error as Error).message);
        res.status(500).json({message: `error while fetching Hod`, error: (error as Error).message});
    }
}


export const deleteHodController = async(req:Request, res: Response):Promise<void>=>{
    try {
        const {id} = req.params;
        if(!id){
            res.status(400).json({error: `Id is required`});
            return;
        }
        const response = await deleteHod(Number(id));
        if(!response){
            res.status(404).json({error: `Id not found or delete failed`});
            return;
        }
        res.status(200).json({message: `Hod and related child data deleted succuessfully`});
        // res.status(200).json({message: `Principal and child data deleted succuessfully`, data: response});
    } catch (error) {
        console.error(`error in deleting Hod and related child data: (controller)`,(error as Error).message);
        res.status(500).json({message: `Error while deleting Hod`, error: (error as Error).message});
    }
}