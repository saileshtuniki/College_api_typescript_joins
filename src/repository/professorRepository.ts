import pool from '../config/dbConnect';
import professorQueries from '../queries/professorSqlQueries';
import { Professor, ProfessorResponse } from '../exportInterfaces/professorInterface';


export const insertProfessor = async (name: string, parentId: number): Promise<Professor | null> => {
    try {
        await pool.query(professorQueries.addProfessorProc, [name, parentId]);
        // return result.rows[0]; // Returns newly inserted professor

        // for the below await we are getting all professors details while adding new one.
        // const insertedProfessor = await fetchProfessor();
        // return insertedProfessor!;

        const insertedProfessor = await pool.query(
            `select * from Professor where name= $1 and hodId=$2 order by id DESC LIMIT 1`,
            [name, parentId]
        );

        if(insertedProfessor.rows.length === 0){
            throw new Error(`Professor insertion failed`);
        }
        // return  result.rows[0] as Hod;
        return  insertedProfessor.rows[0] as Professor;

    } catch (error) {
        console.error('Error inserting professor:', (error as Error).message);
        throw new Error('Failed to insert professor: ' + (error as Error).message);
    }
};

export const fetchProfessor = async (): Promise<Professor[]> => {
    try {
        const result = await pool.query(professorQueries.professorView);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching professors:', (error as Error).message);
        throw new Error('Failed to fetch professors');
    }
};

export const fetchProfessorById = async (id: number): Promise<Professor> => {
    try {
        const result = await pool.query(professorQueries.fetchProfessorByIdFunc, [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error fetching professor by ID:', (error as Error).message);
        throw new Error('Failed to fetch professor by ID');
    }
};

export const updateProfessor = async (id: number, name: string): Promise<ProfessorResponse> => {
    try {
        const result = await pool.query(professorQueries.updateProfessorProc, [id, name]);
        if(result.rowCount === 0){
            return {message: `Hod with id: ${id} not found`}
        }
        const updateHod = await pool.query(professorQueries.fetchProfessorByIdFunc,[id]);
        return {
            success: true, 
            message: `Professor with id:${id} updated successfully`,
            data: updateHod.rows[0] as Professor,
            };
    } catch (error) {
        console.error('Error updating professor:', (error as Error).message);
        throw new Error('Failed to update professor');
    }
};

// export const removeProfessor = async (id: number): Promise<{ message: string }> => {
//     try {
//         await pool.query(professorQueries.deleteProfessorProc, [id]);
//         return { message: `Professor ID ${id} deleted successfully` };
//     } catch (error) {
//         console.error('Error deleting professor:', (error as Error).message);
//         throw new Error('Failed to remove professor');
//     }
// };

export const fetchAllProfById = async (id: number): Promise<Professor | null> => {
    try {
        const result = await pool.query(professorQueries.fetchAllProfByIdFunc, [id]);
        return result.rows[0] || null;
    } catch (error) {
        throw new Error(`Error in fetching Professor and its child nodes by ID: ${(error as Error).message}`);
    }
};

export const deleteAllProfessorById = async(id: number):Promise<boolean>=>{
    try {

        const checkResult = await pool.query(`select id from college_hierarchy_tree where id=$1`,[id]);
        if(checkResult.rowCount === 0){
            return false;
        }
        await pool.query(professorQueries.deleteProfessorProc,[id]);
        return true;
    } catch (error) {
        throw new Error(`(Repository) Error in deleting Professor by Id: ${(error as Error).message}`);
    }
}