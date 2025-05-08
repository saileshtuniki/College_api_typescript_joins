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
exports.deleteStudentController = exports.updateStudentController = exports.getStudentByIdController = exports.getStudentsController = exports.addStudentController = void 0;
const studentService_1 = require("../service/studentService");
// import { Student } from '../exportInterfaces/studentInterface';
const addStudentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Inside addStudentController');
    try {
        const { name, parentId } = req.body;
        if (!name || !parentId) {
            console.log('Validation failed');
            res.status(400).json({ success: false, message: 'Name and Parent ID are required' });
            return;
        }
        console.log('Calling addStudentService');
        const response = yield (0, studentService_1.addStudentService)(name, parentId);
        console.log('Student added:', response);
        res.status(201).json({ message: 'Student added successfully', data: response });
    }
    catch (error) {
        console.error('Error in addStudentController:', error);
        res.status(500).json({ success: false, message: 'Cannot add Student', error: error.message });
    }
});
exports.addStudentController = addStudentController;
const getStudentsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, studentService_1.getStudentService)();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getStudentsController = getStudentsController;
const getStudentByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const response = yield (0, studentService_1.getStudentByIdService)(id);
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getStudentByIdController = getStudentByIdController;
const updateStudentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        if (!name || isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid ID and Name are required' });
            return;
        }
        const response = yield (0, studentService_1.updateStudentService)(id, name);
        res.status(200).json({ message: 'Student updated successfully', data: response });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.updateStudentController = updateStudentController;
const deleteStudentController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: `Id is required` });
            return;
        }
        const response = yield (0, studentService_1.deleteStudent)(Number(id));
        if (!response) {
            res.status(404).json({ message: `id not found or delete failed` });
        }
        res.status(200).json({ message: `Student id: ${id} deleted successfully` });
    }
    catch (error) {
        console.error(`error in deleting student and related child data: (controller)`, error.message);
        res.status(500).json({ message: 'Cannot delete Student', error: error.message });
    }
});
exports.deleteStudentController = deleteStudentController;
