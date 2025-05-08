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
exports.deleteAllHodById = exports.fetchAllHodById = exports.updateHodRepository = exports.fetchHodById = exports.fetchHod = exports.insertHod = void 0;
const dbConnect_1 = __importDefault(require("../config/dbConnect"));
const hodSqlQueries_1 = __importDefault(require("../queries/hodSqlQueries"));
const insertHod = (name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const values = [name, parentId, null, null, null, null];
        const values = [name, parentId];
        // const result = await pool.query(hodQueries.addHodProc, values);
        yield dbConnect_1.default.query(hodSqlQueries_1.default.addHodProc, values);
        // if (result.rows.length === 0) {
        //     return null; // Handle case where no record is found
        // }
        // Extract returned values (PostgreSQL procedures don't return rows, so we fetch manually)
        const insertedHod = yield dbConnect_1.default.query(`SELECT * FROM Hod WHERE name = $1 AND principalId = $2 ORDER BY id DESC LIMIT 1`, [name, parentId]);
        if (insertedHod.rows.length === 0) {
            throw new Error(`HOD insertion failed`);
        }
        // return  result.rows[0] as Hod;
        return insertedHod.rows[0];
    }
    catch (error) {
        throw new Error(`Error in adding Hod(repository) ${error.message}`);
    }
});
exports.insertHod = insertHod;
const fetchHod = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(hodSqlQueries_1.default.hodView);
        return result.rows;
    }
    catch (error) {
        throw new Error(`Error in fetching Hod details: ${error.message}`);
    }
});
exports.fetchHod = fetchHod;
const fetchHodById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(hodSqlQueries_1.default.fetchHodByIdFunc, [id]);
        if (result.rows[0] === 0) {
            throw new Error(`Hod not found`);
        }
        return result.rows[0];
    }
    catch (error) {
        throw new Error(`Error in fetching Hod by Id: ${error.message}`);
    }
});
exports.fetchHodById = fetchHodById;
const updateHodRepository = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(hodSqlQueries_1.default.updateHodProc, [id, name]);
        if (result.rowCount === 0) {
            return { message: `Hod with ${id} not found` };
        }
        const updateHod = yield dbConnect_1.default.query(hodSqlQueries_1.default.fetchHodByIdFunc, [id]);
        return {
            message: `Hod with id: ${id} updated successfully`,
            data: updateHod.rows[0],
        };
    }
    catch (error) {
        throw new Error(`Error in updating hod (repository) by Id: ${error.message}`);
    }
});
exports.updateHodRepository = updateHodRepository;
const fetchAllHodById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield dbConnect_1.default.query(hodSqlQueries_1.default.fetchAllHodByIdFunc, [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    }
    catch (error) {
        throw new Error(`Error in fetching hod (repository) by Id: ${error.message}`);
    }
});
exports.fetchAllHodById = fetchAllHodById;
const deleteAllHodById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //checking if id exists
        const checkResult = yield dbConnect_1.default.query(`select id from college_hierarchy_tree where id=$1`, [id]);
        if (checkResult.rowCount === 0) {
            console.log(`ID ${id} not found in database`);
            return false; // no matching found.
        }
        //if ID exists, proceed with deletion
        yield dbConnect_1.default.query(hodSqlQueries_1.default.deleteHodProc, [id]);
        return true;
    }
    catch (error) {
        throw new Error(`(Repository) Error in deleting Hod by Id: ${error.message}`);
    }
});
exports.deleteAllHodById = deleteAllHodById;
