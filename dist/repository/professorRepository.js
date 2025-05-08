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
exports.deleteAllProfessorById = exports.fetchAllProfById = exports.updateProfessor = exports.fetchProfessorById = exports.fetchProfessor = exports.insertProfessor = void 0;
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const professorSqlQueries_1 = __importDefault(require("../queries/professorSqlQueries"));
const insertProfessor = (name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbConnect_1.default.query(professorSqlQueries_1.default.addProfessorProc, [name, parentId]);
        // return result.rows[0]; // Returns newly inserted professor
        // for the below await we are getting all professors details while adding new one.
        // const insertedProfessor = await fetchProfessor();
        // return insertedProfessor!;
        const insertedProfessor = yield dbConnect_1.default.query(`select * from Professor where name= $1 and hodId=$2 order by id DESC LIMIT 1`, [name, parentId]);
        if (insertedProfessor.rows.length === 0) {
            throw new Error(`Professor insertion failed`);
        }
        // return  result.rows[0] as Hod;
        return insertedProfessor.rows[0];
    }
    catch (error) {
        console.error('Error inserting professor:', error.message);
        throw new Error('Failed to insert professor: ' + error.message);
    }
});
exports.insertProfessor = insertProfessor;
const fetchProfessor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(professorSqlQueries_1.default.professorView);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching professors:', error.message);
        throw new Error('Failed to fetch professors');
    }
});
exports.fetchProfessor = fetchProfessor;
const fetchProfessorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(professorSqlQueries_1.default.fetchProfessorByIdFunc, [id]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching professor by ID:', error.message);
        throw new Error('Failed to fetch professor by ID');
    }
});
exports.fetchProfessorById = fetchProfessorById;
const updateProfessor = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(professorSqlQueries_1.default.updateProfessorProc, [id, name]);
        if (result.rowCount === 0) {
            return { message: `Hod with id: ${id} not found` };
        }
        const updateHod = yield dbConnect_1.default.query(professorSqlQueries_1.default.fetchProfessorByIdFunc, [id]);
        return {
            success: true,
            message: `Professor with id:${id} updated successfully`,
            data: updateHod.rows[0],
        };
    }
    catch (error) {
        console.error('Error updating professor:', error.message);
        throw new Error('Failed to update professor');
    }
});
exports.updateProfessor = updateProfessor;
// export const removeProfessor = async (id: number): Promise<{ message: string }> => {
//     try {
//         await pool.query(professorQueries.deleteProfessorProc, [id]);
//         return { message: `Professor ID ${id} deleted successfully` };
//     } catch (error) {
//         console.error('Error deleting professor:', (error as Error).message);
//         throw new Error('Failed to remove professor');
//     }
// };
const fetchAllProfById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(professorSqlQueries_1.default.fetchAllProfByIdFunc, [id]);
        return result.rows[0] || null;
    }
    catch (error) {
        throw new Error(`Error in fetching Professor and its child nodes by ID: ${error.message}`);
    }
});
exports.fetchAllProfById = fetchAllProfById;
const deleteAllProfessorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkResult = yield dbConnect_1.default.query(`select id from college_hierarchy_tree where id=$1`, [id]);
        if (checkResult.rowCount === 0) {
            return false;
        }
        yield dbConnect_1.default.query(professorSqlQueries_1.default.deleteProfessorProc, [id]);
        return true;
    }
    catch (error) {
        throw new Error(`(Repository) Error in deleting Professor by Id: ${error.message}`);
    }
});
exports.deleteAllProfessorById = deleteAllProfessorById;
