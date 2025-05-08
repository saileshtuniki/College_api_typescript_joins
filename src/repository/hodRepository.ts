
import pool from '../config/dbConnect';

import hodQueries from '../queries/hodSqlQueries';

import {Hod, HodResponse} from '../exportInterfaces/hodInterface';
import { QueryResult } from 'pg';


const insertHod = async(name: string, parentId: number):Promise<Hod> =>{
    try {
        // const values = [name, parentId, null, null, null, null];
        const values = [name, parentId];
        // const result = await pool.query(hodQueries.addHodProc, values);
        await pool.query(hodQueries.addHodProc, values);
        // if (result.rows.length === 0) {
        //     return null; // Handle case where no record is found
        // }

         // Extract returned values (PostgreSQL procedures don't return rows, so we fetch manually)
         const insertedHod = await pool.query(
            `SELECT * FROM Hod WHERE name = $1 AND principalId = $2 ORDER BY id DESC LIMIT 1`,
            [name, parentId]
        );

        if(insertedHod.rows.length === 0){
            throw new Error(`HOD insertion failed`);
        }

        // return  result.rows[0] as Hod;
        return  insertedHod.rows[0] as Hod;
    } catch (error) {
        throw new Error (`Error in adding Hod(repository) ${(error as Error).message}`);
    }
}


const fetchHod = async(): Promise<Hod[]> =>{
    try {
        const result = await pool.query(hodQueries.hodView);
        return result.rows ;
    } catch (error) {
        throw new Error(`Error in fetching Hod details: ${(error as Error).message}`);
    }
};

const fetchHodById = async(id: number): Promise<Hod> =>{
    try {
        const result = await pool.query(hodQueries.fetchHodByIdFunc,[id]);
        if(result.rows[0] === 0){
            throw new Error(`Hod not found`);
        }
        return result.rows[0] as Hod;
    } catch (error) {
        throw new Error(`Error in fetching Hod by Id: ${(error as Error).message}`)
    }
}

const updateHodRepository = async(id: number, name: string): Promise<HodResponse> =>{
    try {
        const result = await pool.query(hodQueries.updateHodProc,[id, name]);
        if(result.rowCount === 0){
            return {message: `Hod with ${id} not found`}
        }
        const updateHod  = await pool.query(hodQueries.fetchHodByIdFunc,[id]);
        return {
            message: `Hod with id: ${id} updated successfully`,
            data: updateHod.rows[0] as Hod,
        }
    } catch (error) {
        throw new Error(`Error in updating hod (repository) by Id: ${(error as Error).message}`);
    }
}

const fetchAllHodById = async(id: number):Promise<Hod | null> =>{
    try {
        const result : QueryResult<Hod>  = await pool.query(hodQueries.fetchAllHodByIdFunc,[id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
        throw new Error(`Error in fetching hod (repository) by Id: ${(error as Error).message}`);
    }
}

const deleteAllHodById = async(id: number): Promise<boolean> =>{
    try {

        //checking if id exists
        const checkResult = await pool.query(`select id from college_hierarchy_tree where id=$1`,[id]);
        if(checkResult.rowCount === 0){
            console.log(`ID ${id} not found in database`);
            return false; // no matching found.
        }
        //if ID exists, proceed with deletion
        await pool.query(hodQueries.deleteHodProc,[id]);
        return true;
    } catch (error) {
        throw new Error(`(Repository) Error in deleting Hod by Id: ${(error as Error).message}`);
    }
}

export {insertHod, fetchHod, fetchHodById, updateHodRepository, fetchAllHodById, deleteAllHodById};


