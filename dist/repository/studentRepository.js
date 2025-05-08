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
exports.deleteAllStudentById = exports.updateStudent = exports.fetchStudentById = exports.fetchStudent = exports.insertStudent = void 0;
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const studentSqlQueries_1 = __importDefault(require("../queries/studentSqlQueries"));
const insertStudent = (name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield dbConnect_1.default.query(studentSqlQueries_1.default.addStudentProc, [name, parentId]);
        // store proc inserts student,  so we can fetch the student by id
        // const insertedStudent = await fetchStudent(); // fetching student by id
        // return insertedStudent;
        const inseertedStudent = yield dbConnect_1.default.query(`select * from Student where name=$1 and professorId=$2 order by id DESC LIMIT 1`, [name, parentId]);
        if (inseertedStudent.rows.length === 0) {
            throw new Error(`Professor insertion failed`);
        }
        // return  result.rows[0] as Hod;
        return inseertedStudent.rows[0];
        // return result.rows[0];
    }
    catch (error) {
        console.error('Error inserting student:', error.message);
        throw new Error('Failed to insert student: ' + error.message);
    }
});
exports.insertStudent = insertStudent;
const fetchStudent = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(studentSqlQueries_1.default.studentView);
        return result.rows;
    }
    catch (error) {
        console.error('Error fetching students:', error.message);
        throw new Error('Failed to fetch students');
    }
});
exports.fetchStudent = fetchStudent;
const fetchStudentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(studentSqlQueries_1.default.fetchStudentByIdFunc, [id]);
        return result.rows[0];
    }
    catch (error) {
        console.error('Error fetching student by ID:', error.message);
        throw new Error('Failed to fetch student by ID');
    }
});
exports.fetchStudentById = fetchStudentById;
const updateStudent = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const result = await pool.query(studentQueries.updateStudentProc, [id, name]);
        yield dbConnect_1.default.query(studentSqlQueries_1.default.updateStudentProc, [id, name]);
        // if(result.rowCount === 0){
        //     return {message: `Student with id: ${id} not found`}
        // }
        const updatedStudentDetails = yield dbConnect_1.default.query(studentSqlQueries_1.default.fetchStudentByIdFunc, [id]);
        console.log(updatedStudentDetails);
        return {
            success: true,
            message: `Updated student with id:${id} successfully`,
            data: updatedStudentDetails.rows[0]
        };
        // return { message: 'Student updated successfully' };
    }
    catch (error) {
        console.error('Error updating student:', error.message);
        throw new Error('Failed to update student');
    }
});
exports.updateStudent = updateStudent;
const deleteAllStudentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const checkResult = yield dbConnect_1.default.query(`select id from college_hierarchy_tree where id=$1`, [id]);
        if (checkResult.rowCount === 0) {
            return false;
        }
        yield dbConnect_1.default.query(studentSqlQueries_1.default.deleteStudentProc, [id]);
        return true;
    }
    catch (error) {
        throw new Error(`(Repository) Error in deleting Student by Id: ${error.message}`);
    }
});
exports.deleteAllStudentById = deleteAllStudentById;
// export const removeStudent = async (id: number): Promise<{ message: string }> => {
//     try {
//         await pool.query(studentQueries.deleteStudentProc, [id]);
//         return { message: `Student ID ${id} deleted successfully` };
//     } catch (error) {
//         console.error('Error deleting student:', (error as Error).message);
//         throw new Error('Failed to remove student');
//     }
// };
