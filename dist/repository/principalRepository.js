"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllById = exports.fetchAllById = exports.updatePrincipal = exports.fetchprincipalById = exports.fetchPrincipal = exports.insertPrincipal = void 0;
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const principalSqlQueries_1 = __importDefault(require("../queries/principalSqlQueries"));
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
// working with view i.e fetchPrincipal. (So, i can view the principal info with principalView ).
const insertPrincipal = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Call the stored procedure to insert the principal
        const result = yield dbConnect_1.default.query(principalSqlQueries_1.default.addPrincipalProc, [name]);
        // Assuming the stored procedure inserts successfully, you can now fetch the principal by id
        const insertedPrincipal = yield (0, exports.fetchPrincipal)(); // Fetch the principal by ID
        return insertedPrincipal;
    }
    catch (error) {
        throw new Error(`Error inserting principal: ${error.message}`);
    }
});
exports.insertPrincipal = insertPrincipal;
const fetchPrincipal = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(principalSqlQueries_1.default.principalView);
        return result.rows[0];
    }
    catch (error) {
        throw new Error(`Error in fetching principal: ${error.message}`);
    }
});
exports.fetchPrincipal = fetchPrincipal;
const fetchprincipalById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(principalSqlQueries_1.default.fetchPrincipalByIdQuery, [id]);
        if (result.rows[0] === 0) {
            return null;
        }
        return result.rows[0];
    }
    catch (error) {
        throw new Error(`Error in fetching principal by Id: ${error.message}`);
    }
});
exports.fetchprincipalById = fetchprincipalById;
const updatePrincipal = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(principalSqlQueries_1.default.updatePrincipalProc, [id, name]);
        // Ensure the result has data (check for updated principal)
        if (result.rowCount === 0) {
            return { message: `Principal with ${id} not found. No update was made` };
        }
        const updatePrincipal = yield dbConnect_1.default.query(principalSqlQueries_1.default.fetchPrincipalByIdQuery, [id]);
        return {
            message: `Principal with id: ${id} updated successfully`,
            data: updatePrincipal.rows[0],
        };
        // return result.rows[0] as Principal;
    }
    catch (error) {
        throw new Error(`Error in updating prinicpal by Id: ${error.message}`);
    }
});
exports.updatePrincipal = updatePrincipal;
const fetchAllById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(principalSqlQueries_1.default.fetchAllById, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    catch (error) {
        throw new Error(`Error in fetching prinicpal and child data by Id: ${error.message}`);
    }
});
exports.fetchAllById = fetchAllById;
const deleteAllById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //checking if id exists
        const checkResult = yield dbConnect_1.default.query(`select id from college_hierarchy_tree where id=$1`, [id]);
        if (checkResult.rowCount === 0) {
            console.log(`ID ${id} not found in database`);
            return false; // no matching found.
        }
        //if ID exists, proceed with deletion
        yield dbConnect_1.default.query(principalSqlQueries_1.default.deletePrincipalProc, [id]);
        return true;
    }
    catch (error) {
        throw new Error(`(Repository) Error in deleting prinicpal by Id: ${error.message}`);
    }
});
exports.deleteAllById = deleteAllById;
