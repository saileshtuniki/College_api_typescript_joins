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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProfessor = exports.getAllProfById = exports.serviceUpdateProfessor = exports.getProfessorById = exports.getProfessor = exports.addProfessor = void 0;
const professorRepository_1 = require("../repository/professorRepository");
const addProfessor = (name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!name || !parentId) {
            throw new Error('Name and Parent ID are required');
        }
        return yield (0, professorRepository_1.insertProfessor)(name, parentId);
    }
    catch (error) {
        console.error('Error adding professor:', error.message);
        throw new Error('Failed to add professor');
    }
});
exports.addProfessor = addProfessor;
const getProfessor = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, professorRepository_1.fetchProfessor)();
    }
    catch (error) {
        console.error('Error fetching professors:', error.message);
        throw new Error('Failed to fetch professors');
    }
});
exports.getProfessor = getProfessor;
const getProfessorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id)
            throw new Error('ID is required');
        return yield (0, professorRepository_1.fetchProfessorById)(id);
    }
    catch (error) {
        console.error('Error fetching professor by ID:', error.message);
        throw new Error('Failed to fetch professor by ID');
    }
});
exports.getProfessorById = getProfessorById;
const serviceUpdateProfessor = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id || !name)
            throw new Error('ID and Name are required');
        return yield (0, professorRepository_1.updateProfessor)(id, name);
    }
    catch (error) {
        console.error('Error updating professor:', error.message);
        throw new Error('Failed to update professor');
    }
});
exports.serviceUpdateProfessor = serviceUpdateProfessor;
const getAllProfById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error('Id is required');
        }
        const result = yield (0, professorRepository_1.fetchAllProfById)(id);
        if (!result) {
            throw new Error(`Professor not Found`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in fetching Professor:${error.message}`);
    }
});
exports.getAllProfById = getAllProfById;
const deleteProfessor = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error('Professor ID is required');
        }
        const result = yield (0, professorRepository_1.deleteAllProfessorById)(id);
        if (!result) {
            throw new Error(`No matching ID found to delete (service)`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in deleting data from professor and related child data(service), ${error.message}`);
    }
});
exports.deleteProfessor = deleteProfessor;
// export const addProfessor = async (name: string, parentId: number): Promise<Professor> => {
//     if (!name || !parentId) {
//         throw new Error('Name and Parent ID are required');
//     }
//     return await insertProfessor(name, parentId);
// };
// export const getProfessor = async (): Promise<Professor[]> => {
//     return await fetchProfessor();
// };
// export const getProfessorById = async (id: number): Promise<Professor> => {
//     if (!id) throw new Error('ID is required');
//     return await fetchProfessorById(id);
// };
// export const serviceUpdateProfessor = async (id: number, name: string): Promise<{ message: string }> => {
//     if (!id || !name) throw new Error('ID and Name are required');
//     return await updateProfessor(id, name);
// };
// export const deleteProfessor = async (id: number): Promise<{ message: string }> => {
//     if (!id) throw new Error('ID is required');
//     return await removeProfessor(id);
// };
// export const getAllProfById = async (id: number): Promise<Professor | null> => {
//     if (!id) throw new Error('ID is required');
//     return await fetchAllProfById(id);
// };
