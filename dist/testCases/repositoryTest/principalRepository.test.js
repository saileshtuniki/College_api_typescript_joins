"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
// mock the database , so real db dont effect
jest.mock('../../config/dbConnect', () => ({
    query: jest.fn(), // Mock the query method
}));
const dbConnect_1 = __importDefault(require("../../config/dbConnect")); // Import the mocked pool
const principalRepository = __importStar(require("../../repository/principalRepository"));
const principalSqlQueries_1 = __importDefault(require("../../queries/principalSqlQueries"));
const node_test_1 = require("node:test");
describe('Repository layer Test Cases', () => {
    describe('insertPrincipal repo', () => {
        it('it should insert a principal into database', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPrincipal = { id: 1, name: 'test principal', role: 'Principal', parentId: null };
            dbConnect_1.default.query.mockResolvedValue({
                rows: [newPrincipal]
            });
            jest.spyOn(principalRepository, 'fetchPrincipal').mockResolvedValueOnce(newPrincipal);
            const result = yield principalRepository.insertPrincipal(newPrincipal.name);
            expect(result).toEqual(newPrincipal);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.addPrincipalProc, [newPrincipal.name]);
            expect(principalRepository.fetchPrincipal).toHaveBeenCalled();
        }));
        it('it should throw error if any query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query failed';
            dbConnect_1.default.query.mockRejectedValueOnce(new Error(errorMessage));
            // jest.spyOn(principalRepository, 'insertPrincipal').mockRejectedValueOnce(new Error(errorMessage));
            yield expect(principalRepository.insertPrincipal('test principal')).rejects.toThrow(`Error inserting principal: ${errorMessage}`);
        }));
    });
    describe('fetchPrincipal repo', () => {
        (0, node_test_1.beforeEach)(() => {
            jest.clearAllMocks();
        });
        it('it should fetch the principal data', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockGetPrincialData = { id: 1, name: 'test principal', role: 'Principal', parentId: null };
            dbConnect_1.default.query.mockResolvedValue({
                rows: [mockGetPrincialData]
            });
            // jest.spyOn(principalRepository, 'fetchPrincipal').mockResolvedValueOnce(mockGetPrincialData as unknown as void)
            const result = yield principalRepository.fetchPrincipal();
            expect(result).toEqual(mockGetPrincialData);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.principalView);
        }));
        it('it should throw an error if query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fails';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(principalRepository.fetchPrincipal).rejects.toThrow(`Error in fetching principal: ${errorMessage}`);
        }));
    });
    describe('fetchprincipalById repo', () => {
        const principalId = 1;
        const mockPrincipalById = { id: 1, name: 'test principal', role: 'Principal', parentId: null };
        (0, node_test_1.beforeEach)(() => {
            jest.clearAllMocks();
        });
        it('it should return the principal data based on Id', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValue({
                rows: [mockPrincipalById]
            });
            const result = yield principalRepository.fetchprincipalById(principalId);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.fetchPrincipalByIdQuery, [principalId]);
            expect(result).toEqual(mockPrincipalById);
        }));
        it('it should return null if no data found based on given Id', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValue({
                rows: [],
            });
            const result = yield principalRepository.fetchprincipalById(principalId);
            expect(result).toBeNull();
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.fetchPrincipalByIdQuery, [principalId]);
        }));
        it('throw error when query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fails';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(principalRepository.fetchprincipalById).rejects.toThrow(`Error in fetching principal by Id: ${errorMessage}`);
        }));
    });
    describe('updatePrincipal repo', () => {
        const id = 1;
        const name = 'Updated Principal';
        const mockPrincipal = {
            id,
            name,
            role: 'Principal',
            parentId: null
        };
        (0, node_test_1.beforeEach)(() => {
            jest.clearAllMocks();
        });
        it('it should update the principal details', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query
                .mockResolvedValue({ rowCount: 1 }) //update query result
                .mockResolvedValue({ rows: [mockPrincipal] }); //fetch updated principal
            const result = yield (principalRepository.updatePrincipal(id, name));
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.updatePrincipalProc, [id, name]);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.fetchPrincipalByIdQuery, [id]);
            expect(result).toEqual({
                message: `Principal with id: ${id} updated successfully`,
                data: mockPrincipal
            });
        }));
        it('it should show principal not found, when no update was made', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValueOnce({ rowCount: 0 }); //no update was made
            const result = yield (principalRepository.updatePrincipal(id, name));
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.updatePrincipalProc, [id, name]);
            expect(result).toEqual({
                message: `Principal with ${id} not found. No update was made`,
            });
        }));
        it('it should throw error if query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fail';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(principalRepository.updatePrincipal(id, name)).rejects.toThrow(`Error in updating prinicpal by Id: ${errorMessage}`);
        }));
    });
    describe('fetchAllById repo', () => {
        const id = 19;
        const mockFetchAllById = { id, name: 'test principal', role: 'Principal', parentId: null };
        (0, node_test_1.beforeEach)(() => {
            jest.clearAllMocks();
        });
        //49 test case
        it('it should fetch All data along with principal and its sub nodes', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValue({ rows: [mockFetchAllById] });
            const result = yield (principalRepository.fetchAllById(id));
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.fetchAllById, [id]);
            expect(result).toEqual(mockFetchAllById);
        }));
        it('it should return null if there is no rows are returned', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValue({ rows: [] });
            const result = yield (principalRepository.fetchAllById(id));
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(principalSqlQueries_1.default.fetchAllById, [id]);
            expect(result).toBeNull();
        }));
        //50 
        it('it should throw error if there is any query issue', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fail';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(principalRepository.fetchAllById).rejects.toThrow(`Error in fetching prinicpal and child data by Id: ${errorMessage}`);
        }));
    });
    describe('deleteAllById', () => {
        const id = 69;
        // const mockedData: Principal = {id, name:'test principal' , role:'Principal', parentId: null};
        (0, node_test_1.beforeEach)(() => {
            jest.clearAllMocks();
        });
        it('it checks does Id exists or not', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValue({ rowCount: 0 });
            const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
            const result = yield principalRepository.deleteAllById(id);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`, [id]);
            expect(logSpy).toHaveBeenCalledWith(`ID ${id} not found in database`);
            expect(result).toBe(false);
            logSpy.mockRestore();
        }));
        it('it should delete the id if ID exists', () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query
                .mockResolvedValue({ rowCount: 1, rows: [{ id }] })
                .mockResolvedValue({ rowCount: 1 });
            const result = yield principalRepository.deleteAllById(id);
            expect(dbConnect_1.default.query).toHaveBeenNthCalledWith(1, `select id from college_hierarchy_tree where id=$1`, [id]);
            expect(dbConnect_1.default.query).toHaveBeenNthCalledWith(2, principalSqlQueries_1.default.deletePrincipalProc, [id]);
            expect(result).toBe(true);
        }));
        it('it should throw error if there is query fail', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fail';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(principalRepository.deleteAllById).rejects.toThrow(`(Repository) Error in deleting prinicpal by Id: ${errorMessage}`);
        }));
    });
});
