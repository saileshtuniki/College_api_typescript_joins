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
exports.deleteProfessorController = exports.getAllProfByIdController = exports.updateProfessorController = exports.getProfessorByIdController = exports.getProfessorsController = exports.addProfessorController = void 0;
const professorService_1 = require("../service/professorService");
const addProfessorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, parentId } = req.body;
        if (!name || !parentId) {
            res.status(400).json({ success: false, message: 'Name and Parent ID are required' });
            return;
        }
        const response = yield (0, professorService_1.addProfessor)(name, parentId);
        res.status(201).json({
            message: 'Professor added successfully',
            data: response
        });
        return;
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Cannot add Professor', error: error.message });
    }
});
exports.addProfessorController = addProfessorController;
const getProfessorsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, professorService_1.getProfessor)();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
});
exports.getProfessorsController = getProfessorsController;
const getProfessorByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid ID format' });
            return;
        }
        const response = yield (0, professorService_1.getProfessorById)(id);
        if (!response) {
            res.status(404).json({ error: `Professor with ${id} not found (controller)` });
        }
        res.status(200).json({ data: response });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getProfessorByIdController = getProfessorByIdController;
const updateProfessorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        if (!name || isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid ID and Name are required' });
            return;
        }
        const response = yield (0, professorService_1.serviceUpdateProfessor)(id, name);
        res.status(200).json({ message: 'Professor updated successfully', data: response });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.updateProfessorController = updateProfessorController;
const getAllProfByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: `Id is required` });
        }
        const response = yield (0, professorService_1.getAllProfById)(Number(id));
        res.status(200).json({ message: `Professor data fetched successfully`, data: response });
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});
exports.getAllProfByIdController = getAllProfByIdController;
const deleteProfessorController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: `Id is required` });
            return;
        }
        const response = yield (0, professorService_1.deleteProfessor)(Number(id));
        if (!response) {
            res.status(404).json({ error: `id not found or delete failed` });
        }
        res.status(200).json({ message: `Professor ID ${id} deleted successfully` });
    }
    catch (error) {
        console.error(`error in deleting Professor and related child data: (controller)`, error.message);
        res.status(500).json({ message: 'Cannot delete Professor', error: error.message });
    }
});
exports.deleteProfessorController = deleteProfessorController;
