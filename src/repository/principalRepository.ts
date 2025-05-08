import { Principal } from './../exportInterfaces/principalInterface';


import pool from '../config/dbConnect';
import principalQueries from '../queries/principalSqlQueries';
import { UpdateResponse} from '../exportInterfaces/principalInterface'


// working with view i.e fetchPrincipal. (So, i can view the principal info with principalView ).
export const insertPrincipal = async(name: string): Promise<Principal | null> =>{
    try {
        // Call the stored procedure to insert the principal
        const result = await pool.query(principalQueries.addPrincipalProc, [name]);

        // Assuming the stored procedure inserts successfully, you can now fetch the principal by id
        const insertedPrincipal = await fetchPrincipal();  // Fetch the principal by ID
        return insertedPrincipal!;
    } catch (error) {
        throw new Error(`Error inserting principal: ${(error as Error).message}`);
    }
}; 



export const fetchPrincipal = async():Promise<void>=>{
    try {
        const result = await pool.query(principalQueries.principalView);
        return result.rows[0];
    } catch (error) {
        throw new Error(`Error in fetching principal: ${(error as Error).message}`);
    }
};

export const fetchprincipalById = async(id: number): Promise <Principal | null>=>{
    try {
        const result = await pool.query(principalQueries.fetchPrincipalByIdQuery, [id]);
        if(result.rows.length === 0){
            return null;
        }

        return result.rows[0] as Principal;
    } catch (error) {
        throw new Error(`Error in fetching principal by Id: ${(error as Error).message}`);
    }
}


export const updatePrincipal = async(id: number, name: string): Promise <UpdateResponse> =>{
    try {
        const result = await pool.query(principalQueries.updatePrincipalProc, [id, name]);
         // Ensure the result has data (check for updated principal)
         if (result.rowCount === 0) {
            return {message: `Principal with ${id} not found. No update was made`};
        }
        const updatePrincipal = await pool.query(principalQueries.fetchPrincipalByIdQuery, [id]);
        return {
            message: `Principal with id: ${id} updated successfully`,
            data: updatePrincipal.rows[0] as Principal,
        }
        // return result.rows[0] as Principal;
    } catch (error) {
        throw new Error(`Error in updating prinicpal by Id: ${(error as Error).message}`);
    }
}


export const fetchAllById = async(id: number): Promise<Principal | null>=>{
    try {
        const result = await pool.query(principalQueries.fetchAllById,[id]);
        return result.rows.length > 0 ? result.rows[0] as Principal : null;

    } catch (error) {
        throw new Error(`Error in fetching prinicpal and child data by Id: ${(error as Error).message}`);
    }
}

export const deleteAllById = async(id: number): Promise<boolean> =>{
    try {

        //checking if id exists
        const checkResult = await pool.query(`select id from college_hierarchy_tree where id=$1`,[id]);
        if(checkResult.rowCount === 0){
            console.log(`ID ${id} not found in database`);
            return false; // no matching found.
        }
        //if ID exists, proceed with deletion
        await pool.query(principalQueries.deletePrincipalProc,[id]);
        return true;
    } catch (error) {
        throw new Error(`(Repository) Error in deleting prinicpal by Id: ${(error as Error).message}`);
    }
}



// interface Principal {
//     id: number;
//     name: string;
// }

// export const insertPrincipal = async(name: string): Promise<Principal> =>{
//     try {
//         // calls the store procedure
//         const result = await pool.query(principalQueries.addPrincipalProc, [name]);
    

//         return result.rows[0] as Principal;
//     } catch (error) {
//         throw new Error(`Error inserting principal: ${(error as Error).message}`);
//     }
// }; 

// export const insertPrincipal = async(name: string): Promise<Principal | null> =>{
//     try {
//         // calls the store procedure
//         await pool.query(principalQueries.addPrincipalProc, [name]);
        
//         const principal = await fetchprincipalById(1);
//         return principal;

//         // return result.rows[0] as Principal;
//     } catch (error) {
//         throw new Error(`Error inserting principal: ${(error as Error).message}`);
//     }
// }; 


// export const insertPrincipal = async(name: string): Promise<Principal | null> =>{
//     try {
//         // Call the stored procedure to insert the principal
//         const result = await pool.query(principalQueries.addPrincipalProc, [name]);

//         // Assuming the stored procedure inserts successfully, you can now fetch the principal by id
//         const insertedPrincipal = await fetchprincipalById(result.rows[0].id);  // Fetch the principal by ID
//         return insertedPrincipal!;
//     } catch (error) {
//         throw new Error(`Error inserting principal: ${(error as Error).message}`);
//     }
// }; 