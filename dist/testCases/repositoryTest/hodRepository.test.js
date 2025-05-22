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
// mock the database , so real db wont effect
jest.mock('../../config/dbConnect', () => ({
    query: jest.fn(),
}));
const dbConnect_1 = __importDefault(require("../../config/dbConnect")); //importing the pool after mock
const HodRepo = __importStar(require("../../repository/hodRepository"));
const hodSqlQueries_1 = __importDefault(require("../../queries/hodSqlQueries"));
describe('Repository layer Test cases', () => {
    describe('insertHod repo', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('it should insert a Hod into database', () => __awaiter(void 0, void 0, void 0, function* () {
            const newHod = { id: 2, name: 'Test Hod 1', parentId: 1, role: 'Hod' };
            dbConnect_1.default.query
                .mockResolvedValueOnce({ rows: [] })
                .mockResolvedValueOnce({ rows: [newHod] });
            // jest.spyOn(HodRepo, 'insertHod').mockResolvedValueOnce(newHod as unknown as Hod);
            const result = yield HodRepo.insertHod(newHod.name, newHod.parentId);
            expect(result).toEqual(newHod);
            expect(dbConnect_1.default.query).toHaveBeenNthCalledWith(1, hodSqlQueries_1.default.addHodProc, [newHod.name, newHod.parentId]);
            expect(dbConnect_1.default.query).toHaveBeenNthCalledWith(2, `SELECT * FROM Hod WHERE name = $1 AND principalId = $2 ORDER BY id DESC LIMIT 1`, [newHod.name, newHod.parentId]);
        }));
        it("throws if SELECT finds no rows", () => __awaiter(void 0, void 0, void 0, function* () {
            // procedure runs
            dbConnect_1.default.query
                .mockResolvedValueOnce({ rows: [] })
                // SELECT returns empty
                .mockResolvedValueOnce({ rows: [] });
            yield expect(HodRepo.insertHod("X", 5)).rejects.toThrow("HOD insertion failed");
            expect(dbConnect_1.default.query).toHaveBeenCalledTimes(2);
        }));
        //106 T.Case
        it('it throws error if there is query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fails';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(HodRepo.insertHod('', 99)).rejects.toThrow(`Error in adding Hod(repository) ${errorMessage}`);
            expect(dbConnect_1.default.query).toHaveBeenCalled();
        }));
    });
    describe('fetchHod repository test cases', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        //107
        it('it fetches the hod details', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHodData = { id: 2, name: 'test hod 2', parentId: 1, role: 'Hod' };
            dbConnect_1.default.query.mockResolvedValue({ rows: [mockHodData] });
            const result = yield HodRepo.fetchHod();
            expect(result).toEqual(mockHodData);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.hodView);
        }));
        it('it should throw error if there is any query fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'query fails';
            dbConnect_1.default.query.mockRejectedValue(new Error(errorMessage));
            yield expect(HodRepo.fetchHod()).rejects.toThrow(`Error in fetching Hod details: ${errorMessage}`);
            expect(dbConnect_1.default.query).toHaveBeenCalled();
        }));
    });
    describe("fetchHodById", () => {
        const mockHod = { id: 1, name: "John Doe", department: "Engineering" };
        it("should return the HOD data when found", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValueOnce({ rows: [mockHod] });
            const result = yield HodRepo.fetchHodById(1);
            expect(result).toEqual(mockHod);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchHodByIdFunc, [1]);
        }));
        it("should throw an error when HOD is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValueOnce({ rows: [] });
            yield expect(HodRepo.fetchHodById(99)).rejects.toThrow("Hod not found");
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchHodByIdFunc, [99]);
        }));
        it("should handle database errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockRejectedValueOnce(new Error("Database error"));
            yield expect(HodRepo.fetchHodById(2)).rejects.toThrow("Error in fetching Hod by Id: Database error");
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchHodByIdFunc, [2]);
        }));
    });
    describe("updateHodRepository", () => {
        const mockUpdatedHod = { id: 1, name: "Updated Name", department: "Engineering" };
        it("should update the HOD and return the updated data", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock the update query to return a rowCount of 1 (successful update)
            dbConnect_1.default.query.mockResolvedValueOnce({ rowCount: 1 });
            // Mock the fetch query to return updated HOD details
            dbConnect_1.default.query.mockResolvedValueOnce({ rows: [mockUpdatedHod] });
            const result = yield HodRepo.updateHodRepository(1, "Updated Name");
            expect(result).toEqual({
                message: "Hod with id: 1 updated successfully",
                data: mockUpdatedHod,
            });
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.updateHodProc, [1, "Updated Name"]);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchHodByIdFunc, [1]);
        }));
        it("should return an error message when HOD is not found", () => __awaiter(void 0, void 0, void 0, function* () {
            // Mock the update query to return rowCount as 0 (meaning no record updated)
            dbConnect_1.default.query.mockResolvedValueOnce({ rowCount: 0 });
            const result = yield HodRepo.updateHodRepository(99, "Non-existent Name");
            expect(result).toEqual({
                message: "Hod with 99 not found",
            });
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.updateHodProc, [99, "Non-existent Name"]);
        }));
        it("should handle database errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockRejectedValueOnce(new Error("Database error"));
            yield expect(HodRepo.updateHodRepository(2, "New Name")).rejects.toThrow("Error in updating hod (repository) by Id: Database error");
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.updateHodProc, [2, "New Name"]);
        }));
    });
    describe("fetchAllHodById", () => {
        const mockAllByIdData = {
            hod_id: 2,
            hod_name: "Dr. Nikhil",
            professors: [
                {
                    professor_id: 2,
                    professor_name: "Dr. Kiran",
                    students: [
                        {
                            student_id: 2,
                            student_name: "Vamshi",
                        },
                    ],
                },
            ],
        };
        it("should return the structured HOD data when found", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValueOnce({ rows: [mockAllByIdData] });
            const result = yield HodRepo.fetchAllHodById(2);
            expect(result).toEqual(mockAllByIdData);
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchAllHodByIdFunc, [2]);
        }));
        it("should return null when no data is found", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockResolvedValueOnce({ rows: [] });
            const result = yield HodRepo.fetchAllHodById(99);
            expect(result).toBeNull();
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchAllHodByIdFunc, [99]);
        }));
        it("should handle database errors gracefully", () => __awaiter(void 0, void 0, void 0, function* () {
            dbConnect_1.default.query.mockRejectedValueOnce(new Error("Database error"));
            yield expect(HodRepo.fetchAllHodById(3)).rejects.toThrow("Error in fetching hod (repository) by Id: Database error");
            expect(dbConnect_1.default.query).toHaveBeenCalledWith(hodSqlQueries_1.default.fetchAllHodByIdFunc, [3]);
        }));
    });
});
