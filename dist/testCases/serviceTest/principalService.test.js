"use strict";
// import { insertPrincipal, fetchPrincipal, fetchprincipalById, updatePrincipal as updatePrincipalRepository, fetchAllById, deleteAllById } from '../../repository/principalRepository';
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
const principalRepository = __importStar(require("../../repository/principalRepository"));
const principalService_1 = require("../../service/principalService");
// import { Principal } from '../../exportInterfaces/principalInterface';
jest.mock('../../repository/principalRepository');
describe('principal service tests', () => {
    describe('addPrincipal service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should throw error if name is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, principalService_1.addPrincipal)('')).rejects.toThrow('Name is required');
        }));
        it('it should call insertPrincipal from repository and returns the inserted principal', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPrincipal = 'Test Principal';
            const mockAddPrincipal = { id: 1, name: newPrincipal, role: 'principal', parentId: null };
            principalRepository.insertPrincipal.mockResolvedValue(mockAddPrincipal);
            const result = yield (0, principalService_1.addPrincipal)(newPrincipal);
            expect(principalRepository.insertPrincipal).toHaveBeenCalledWith(newPrincipal);
            expect(result).toEqual(mockAddPrincipal);
        }));
        it('it should throw an error when insert principal fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const validName = 'Test Principal';
            const errorMessgae = 'Database failure';
            jest.spyOn(principalRepository, 'insertPrincipal').mockRejectedValue(new Error(errorMessgae));
            yield expect((0, principalService_1.addPrincipal)(validName)).rejects.toThrow(`Error in adding Principal: ${errorMessgae}`);
        }));
    });
    describe('getPrincipal service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should call the fetchPrincipal from repository and returns the principal data', () => __awaiter(void 0, void 0, void 0, function* () {
            const principalData = { id: 1, name: 'Test Principal', role: 'Principal', parentId: null };
            const mockPrincipalData = Object.assign({}, principalData);
            principalRepository.fetchPrincipal.mockResolvedValue(mockPrincipalData);
            const result = yield (0, principalService_1.getPrincipal)();
            expect(principalRepository.fetchPrincipal).toHaveBeenCalled(); //arg not required
            expect(result).toEqual(mockPrincipalData);
        }));
        it('it should throw an error when fetchPrincipal fails', () => __awaiter(void 0, void 0, void 0, function* () {
            // const validName = {id:1, name: 'Test Principal', role: 'Principal', parentId: null};
            const errorMessage = 'Database failure';
            jest.spyOn(principalRepository, 'fetchPrincipal').mockRejectedValue(new Error(errorMessage));
            yield expect((0, principalService_1.getPrincipal)()).rejects.toThrow(`Error in getting principal: ${errorMessage}`);
        }));
    });
    describe('getPrinicpalById service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it throw error if ID is not provided or valid', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, principalService_1.getPrincipalById)(undefined)).rejects.toThrow('Id is required');
        }));
        it('it should call getPrincipalById from repository and returns the principal by id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPrincipalData = { id: 1, name: 'Test Principal', role: 'Principal', parentId: null };
            principalRepository.fetchprincipalById.mockResolvedValue(mockPrincipalData);
            const result = yield (0, principalService_1.getPrincipalById)(1);
            expect(principalRepository.fetchprincipalById).toHaveBeenCalledWith(1);
            expect(result).toEqual(mockPrincipalData);
        }));
        it('it should throw an error when getById fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const principalId = 1;
            const errorMessage = 'Database failure';
            jest.spyOn(principalRepository, 'fetchprincipalById').mockRejectedValue(new Error(errorMessage));
            yield expect((0, principalService_1.getPrincipalById)(principalId)).rejects.toThrow(`Error in fetching principal by Id: ${errorMessage}`);
        }));
    });
    describe('serviceupdatePrincipal service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should throw an error if id and name are not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, principalService_1.serviceupdatePrincipal)(undefined, '')).rejects.toThrow('ID and Name are required');
        }));
        it('it should throw error if name is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, principalService_1.serviceupdatePrincipal)(1, '')).rejects.toThrow('ID and Name are required');
        }));
        it('it should update principal when valid id and name given', () => __awaiter(void 0, void 0, void 0, function* () {
            const principalId = 1;
            const newName = 'Updated principal';
            const mockResponse = { success: true, message: 'Principal Updated' };
            principalRepository.updatePrincipal.mockResolvedValue(mockResponse);
            const result = yield (0, principalService_1.serviceupdatePrincipal)(principalId, newName);
            expect(result).toEqual(mockResponse);
            expect(principalRepository.updatePrincipal).toHaveBeenCalledWith(principalId, newName);
        }));
        it('it should throw error if principal is not found or update failed', () => __awaiter(void 0, void 0, void 0, function* () {
            principalRepository.updatePrincipal.mockResolvedValue(null);
            yield expect((0, principalService_1.serviceupdatePrincipal)(99, 'updated Name')).rejects.toThrow('Principal not found or update has failed');
        }));
        it('it should throw error if there is any repository operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'Database failure';
            jest.spyOn(principalRepository, 'updatePrincipal').mockRejectedValue(new Error(errorMessage));
            yield expect((0, principalService_1.serviceupdatePrincipal)(1, 'Updated Name')).rejects.toThrow(`Error updating principal: ${errorMessage}`);
        }));
    });
    describe('getAllByIdService service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should throw error if ID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, principalService_1.getAllByIdService)(undefined)).rejects.toThrow('ID is required');
        }));
        // it('it should return all data of principal and sub nodes',async()=>{
        //     const principalId = 1;
        //     const mockResponse = {}
        // })
        it('should return principal data when fetchAllById succeeds', () => __awaiter(void 0, void 0, void 0, function* () {
            const principalId = 1;
            const mockPrincipal = { id: principalId, name: 'Test Principal', role: 'Admin', parentId: null };
            jest.spyOn(principalRepository, 'fetchAllById').mockResolvedValue(mockPrincipal);
            const result = yield (0, principalService_1.getAllByIdService)(principalId);
            expect(result).toEqual(mockPrincipal);
            expect(principalRepository.fetchAllById).toHaveBeenCalledWith(principalId);
        }));
        it('it should throw error if ID not provided or not valid', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(principalRepository, 'fetchAllById').mockResolvedValue(null);
            yield expect((0, principalService_1.getAllByIdService)(99)).rejects.toThrow('Data not found (Service)');
        }));
        it('it should throw error if there is any repository operation has failed', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'Database failed';
            jest.spyOn(principalRepository, 'fetchAllById').mockRejectedValue(new Error(errorMessage));
            yield expect((0, principalService_1.getAllByIdService)(1)).rejects.toThrow(`Error in fetching data from principal: ${errorMessage}`);
        }));
    });
    describe('deletePrincipal service', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should throw error when id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            yield expect((0, principalService_1.deletePrincipal)(undefined)).rejects.toThrow('ID is required');
        }));
        it('it should return true after principal is deleted of specific ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const principalId = 1;
            jest.spyOn(principalRepository, 'deleteAllById').mockResolvedValue(true);
            const result = yield (0, principalService_1.deletePrincipal)(principalId);
            expect(result).toBe(true);
        }));
        it('it will throw error when no matching Id or Id not found', () => __awaiter(void 0, void 0, void 0, function* () {
            jest.spyOn(principalRepository, 'deleteAllById').mockResolvedValue(false);
            yield expect((0, principalService_1.deletePrincipal)(99)).rejects.toThrow('No matching ID found to delete (Service)');
        }));
        it('it should throw error if repository operation fails', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'repository error';
            jest.spyOn(principalRepository, 'deleteAllById').mockRejectedValue(new Error(errorMessage));
            yield expect((0, principalService_1.deletePrincipal)(3)).rejects.toThrow(`Error in deleteing data from principal and child (service): ${errorMessage}`);
        }));
    });
});
