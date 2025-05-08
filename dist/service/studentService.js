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
exports.deleteStudent = exports.updateStudentService = exports.getStudentByIdService = exports.getStudentService = exports.addStudentService = void 0;
const studentRepository_1 = require("../repository/studentRepository");
const addStudentService = (name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!name || !parentId) {
            throw new Error('Name and Parent ID are required');
        }
        return yield (0, studentRepository_1.insertStudent)(name, parentId);
    }
    catch (error) {
        console.error('Error adding student:', error.message);
        throw new Error('Failed to add student');
    }
});
exports.addStudentService = addStudentService;
const getStudentService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield (0, studentRepository_1.fetchStudent)();
    }
    catch (error) {
        console.error('Error fetching students:', error.message);
        throw new Error('Failed to fetch students');
    }
});
exports.getStudentService = getStudentService;
const getStudentByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id)
            throw new Error('ID is required');
        return yield (0, studentRepository_1.fetchStudentById)(id);
    }
    catch (error) {
        console.error('Error fetching student by ID:', error.message);
        throw new Error('Failed to fetch student by ID');
    }
});
exports.getStudentByIdService = getStudentByIdService;
const updateStudentService = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id || !name)
            throw new Error('ID and Name are required');
        return yield (0, studentRepository_1.updateStudent)(id, name);
    }
    catch (error) {
        console.error('Error updating student:', error.message);
        throw new Error('Failed to update student');
    }
});
exports.updateStudentService = updateStudentService;
const deleteStudent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error(`Student ID is required`);
        }
        const result = yield (0, studentRepository_1.deleteAllStudentById)(id);
        if (!result) {
            throw new Error(`No matching ID found to delete (service)`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in deleting data of Student ${error.message}`);
    }
});
exports.deleteStudent = deleteStudent;
// export const deleteStudentService = async (id: number): Promise<{ message: string }> => {
//     try {
//         if (!id) throw new Error('ID is required');
//         return await removeStudent(id);
//     } catch (error) {
//         console.error('Error deleting student:', (error as Error).message);
//         throw new Error('Failed to delete student');
//     }
// };
