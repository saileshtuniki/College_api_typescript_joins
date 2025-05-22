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
Object.defineProperty(exports, "__esModule", { value: true });
const HodRepo = __importStar(require("../../repository/hodRepository"));
const hodService_1 = require("../../service/hodService");
jest.mock('../../repository/hodRepository');
describe('hod service test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    describe('addHod service test', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        // it('it should throw error if ID and name are not given',async()=>{
        //     await expect(addHod('', 2))
        //     .rejects.toThrow('Name and parentId are required');
        //     expect(HodRepo.insertHod).not.toHaveBeenCalled();
        // })
        // it('it should throw error if ID and name are not given',async()=>{
        //     await expect(addHod('', 1))
        //     .rejects.toThrow('Name and parentId are required');
        //     expect(HodRepo.insertHod).not.toHaveBeenCalled();
        // })
        // OR other way in test.each block 
        test.each([
            ['', 5], // empty name
            ['Alice', undefined], // missing parentId
        ])('throws when name=%p, parentId=%p', (badName, badParentId) => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, hodService_1.addHod)(badName, badParentId))
                .rejects
                .toThrow('Name and parentId are required');
            expect(HodRepo.insertHod).not.toHaveBeenCalled();
        }));
        it('it should call the insertHod repo and return the inserted Hod', () => __awaiter(void 0, void 0, void 0, function* () {
            // const mockHodId = 2;
            const mockHodDetails = { id: 2, name: "test hod 2", role: 'Hod', parentId: 1 };
            HodRepo.insertHod.mockResolvedValue(mockHodDetails);
            const result = yield HodRepo.insertHod('Test name 1', 2);
            expect(result).toEqual(mockHodDetails);
        }));
        it('should throw error if repository operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            // const HodDetails = {name: 'test hod 1', id: 2}
            const errorMessage = 'Database failure';
            //jest.spyOn(HodRepo, 'insertHod').mockRejectedValue(new Error(errorMessage));
            HodRepo.insertHod.mockRejectedValue(new Error(errorMessage));
            yield expect((0, hodService_1.addHod)('test hod 1', 2)).rejects.toThrow(`error in adding hod: ${errorMessage}`);
        }));
    });
    describe('getHod service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should return the inserted hod details', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHod = { id: 2, name: "Test hod 1", role: "Hod", parentId: 1 };
            HodRepo.fetchHod.mockResolvedValue(mockHod);
            const result = yield (0, hodService_1.getHod)();
            expect(HodRepo.fetchHod).toHaveBeenCalled();
            expect(result).toEqual(mockHod);
        }));
        it('it should throw an error when fetchHod fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'Database failure';
            HodRepo.fetchHod.mockRejectedValue(new Error(errorMessage));
            yield expect((0, hodService_1.getHod)()).rejects.toThrow(`Fetching data of Hod has failed (service) ${errorMessage}`);
        }));
    });
    describe('getHodById service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it throw error if ID is not provided or valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, hodService_1.getHodById)(undefined)).rejects.toThrow('Id is required');
        }));
        it('it should call getPrincipalById from repository and returns the principal by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHodData = { id: 2, name: "Test hod 1", role: "Hod", parentId: 1 };
            HodRepo.fetchHodById.mockResolvedValue(mockHodData);
            const result = yield (0, hodService_1.getHodById)(2);
            expect(HodRepo.fetchHodById).toHaveBeenCalledWith(2);
            expect(result).toEqual(mockHodData);
        }));
        it('it should throw an error when getById fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const hodId = 1;
            const errorMessage = 'Database failure';
            jest.spyOn(HodRepo, 'fetchHodById').mockRejectedValue(new Error(errorMessage));
            yield expect((0, hodService_1.getHodById)(hodId)).rejects.toThrow(`Error in fetching Hod by id: ${errorMessage}`);
        }));
    });
    describe('ServiceUpdateHod service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        //   it('it throw error if ID is not provided or valid', async()=>{
        //     await expect(ServiceUpdateHod(2,'')).rejects.toThrow('Id and name are required (service)');
        //   })
        // below test case validates 2 cases one for id and other for name
        test.each([
            ["", 5], // empty name
            ["Alice", undefined], // missing parentId
        ])("throws when name=%p, parentId=%p", (badName, badParentId) => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, hodService_1.ServiceUpdateHod)(badParentId, badName)).rejects.toThrow('Id and name are required (service)');
            expect(HodRepo.updateHodRepository).not.toHaveBeenCalled();
        }));
        it('it should throw error if result is null ot hod not found', () => __awaiter(void 0, void 0, void 0, function* () {
            HodRepo.updateHodRepository.mockResolvedValue(null);
            yield expect((0, hodService_1.ServiceUpdateHod)(2, 'test hod 2')).rejects.toThrow(`Hod not found or update has failed`);
        }));
        it('it should call updateHodRepository from repository and updates by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHodData = { id: 2, name: "Test hod 1", role: "Hod", parentId: 1 };
            HodRepo.updateHodRepository.mockResolvedValue(mockHodData);
            const result = yield (0, hodService_1.ServiceUpdateHod)(2, 'updated hod');
            expect(HodRepo.updateHodRepository).toHaveBeenCalledWith(2, 'updated hod');
            expect(result).toEqual(mockHodData);
        }));
        it('it should throw an error when ServiceUpdateHod fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'Database failure';
            jest.spyOn(HodRepo, 'updateHodRepository').mockRejectedValue(new Error(errorMessage));
            yield expect((0, hodService_1.ServiceUpdateHod)(2, 'updated hod')).rejects.toThrow(`Error updating Hod:${errorMessage}`);
        }));
    });
    describe('getAllHodById  result of hod and its sub node connected to it', () => {
        it('it should throw error if ID is not provided or valid', () => __awaiter(void 0, void 0, void 0, function* () {
            // (HodRepo.fetchAllHodById as jest.Mock)
            yield expect((0, hodService_1.getAllHodById)(undefined)).rejects.toThrow('Id is required (service)');
        }));
        it('it resutns the result based on Id given', () => __awaiter(void 0, void 0, void 0, function* () {
            // const mockHodById = {id: 2, name:'test hod', role:'hod', parentId: 1};
            const mockData = {
                message: "data fetched successfully",
                data: {
                    fetchallbyhodid: {
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
                    },
                },
            };
            HodRepo.fetchAllHodById.mockResolvedValue(mockData);
            const result = yield (0, hodService_1.getAllHodById)(3);
            expect(HodRepo.fetchAllHodById).toHaveBeenCalled();
            expect(result).toBe(mockData);
        }));
        it('it should throw error if result is null ot hod not found', () => __awaiter(void 0, void 0, void 0, function* () {
            HodRepo.fetchAllHodById.mockResolvedValue(null);
            yield expect((0, hodService_1.getAllHodById)(2)).rejects.toThrow(`Hod not found or fetching has failed`);
        }));
        it('it should throw error if there is any operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'database error';
            HodRepo.fetchAllHodById.mockRejectedValue(new Error(errorMessage));
            yield expect((0, hodService_1.getAllHodById)(3)).rejects.toThrow(`Error in fetching Hod:${errorMessage}`);
        }));
    });
    describe('deleteHod service test', () => {
        it('it throws error if Id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, hodService_1.deleteHod)(undefined)).rejects.toThrow('ID is required');
        }));
        it('it deletes the data of given Id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHodId = 2;
            jest.spyOn(HodRepo, 'deleteAllHodById').mockResolvedValue(true);
            const result = yield (0, hodService_1.deleteHod)(mockHodId);
            expect(result).toBe(true);
        }));
        it('it will throw error when no matching Id or Id not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(HodRepo, 'deleteAllHodById').mockResolvedValue(false);
            yield expect((0, hodService_1.deleteHod)(99)).rejects.toThrow(`No matching ID found to delete (Service)`);
        }));
        it('it should throw error if repository operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'database error';
            HodRepo.deleteAllHodById.mockRejectedValue(new Error(errorMessage));
            yield expect((0, hodService_1.deleteHod)(99)).rejects.toThrow(`Error in deleteing data from Hod and related child data (service): ${errorMessage}`);
        }));
    });
});
