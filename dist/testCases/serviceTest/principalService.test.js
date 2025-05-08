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
jest.mock('../src/repository/principalRepository');
describe('principal service tests', () => {
    // describe('addPrincipal service', ()=>{
    //   beforeEach(()=>{
    //     jest.clearAllMocks()
    //   })
    //   it('it should call insertPrincipal from repository and returns the inserted principal',async()=>{
    //       const newPrincipal = {name: 'Test Principal'};
    //       const mockAddPrincipal = {id:1, name: newPrincipal};
    //       (principalRepository.insertPrincipal as jest.Mock).mockResolvedValue(mockAddPrincipal);
    //       const result = await addPrincipal(newPrincipal);
    //       expect(principalRepository.insertPrincipal).toHaveBeenCalledWith(result);
    //       expect(result).toEqual(mockAddPrincipal);
    //   })
    // })
    describe('addPrincipal', () => {
        // Reset mocks before each test if needed
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('should add principal successfully when a valid name is provided', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const validName = 'John Doe';
            const mockResult = { id: 1, name: validName, role: "prinicpal", parentId: null };
            // Mock insertPrincipal to resolve with a mock result
            jest.spyOn(principalRepository, 'insertPrincipal').mockResolvedValue(mockResult);
            // Act
            const result = yield (0, principalService_1.addPrincipal)(validName);
            // Assert
            expect(result).toEqual(mockResult);
            expect(principalRepository.insertPrincipal).toHaveBeenCalledWith(validName);
        }));
        it('should throw an error if name is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            // Act & Assert
            yield expect((0, principalService_1.addPrincipal)('')).rejects.toThrow(/Name is required/);
        }));
        it('should throw an error when insertPrincipal fails', () => __awaiter(void 0, void 0, void 0, function* () {
            // Arrange
            const validName = 'Jane Doe';
            const errorMessage = 'Database failure';
            // Simulate repository failure
            jest.spyOn(principalRepository, 'insertPrincipal').mockRejectedValue(new Error(errorMessage));
            // Act & Assert
            yield expect((0, principalService_1.addPrincipal)(validName)).rejects.toThrow(`Error in adding Principal: ${errorMessage}`);
        }));
    });
});
