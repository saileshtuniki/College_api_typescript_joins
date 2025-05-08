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
exports.deletePrincipalController = exports.getAllByIdController = exports.updatePrinicpalController = exports.getPrincipalByIdController = exports.getPrincipalController = exports.addPrincipalController = void 0;
// import {Principal} from '../exportInterfaces/principalInterface'
const principalService_1 = require("../service/principalService");
const addPrincipalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            console.log("Validation failed : Name is missing");
            res.status(400).json({ message: `Name is not Provided` });
            return;
        }
        const response = yield (0, principalService_1.addPrincipal)(name);
        console.log("Principal added successfully", response);
        res.status(200).json({
            success: true,
            message: 'Principal added successfully',
            data: response,
        });
    }
    catch (error) {
        console.error(`Error in adding principal (POST request)`, error.message);
        res.status(500).json({
            success: false,
            message: 'Error in adding principal',
            error: error.message
        });
    }
});
exports.addPrincipalController = addPrincipalController;
const getPrincipalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, principalService_1.getPrincipal)();
        res.status(200).json({
            message: 'Principal fetched successfully',
            data: response
        });
    }
    catch (error) {
        // console.error(`Error in getting pricipal`,(error as Error).message);
        res.status(500).json({
            success: false,
            message: 'Error in getting principal'
        });
    }
});
exports.getPrincipalController = getPrincipalController;
const getPrincipalByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            res.status(400).json({ message: `Invalid Id format` });
            return;
        }
        const response = yield (0, principalService_1.getPrincipalById)(id);
        if (!response) {
            res.status(404).json({ error: 'Principal with id not found' });
            return;
        }
        res.status(200).json({ success: true, messsage: `Principal of id: % ${id}`, data: response });
    }
    catch (error) {
        console.error(`Error in getting pricipal`, error.message);
        res.status(500).json({
            success: false,
            message: 'Error in getting principal'
        });
    }
});
exports.getPrincipalByIdController = getPrincipalByIdController;
const updatePrinicpalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id || !name) {
            res.status(400).json({ error: `Id and name are required` });
            return;
        }
        // Log the values to ensure they're being passed correctly
        // console.log(`Updating principal with id: ${id}, name: ${name}`);
        const response = yield (0, principalService_1.serviceupdatePrincipal)(Number(id), name);
        if (!response) {
            res.status(404).json({ error: `principal not found or update failed` });
            return;
        }
        res.status(200).json({ message: `Principal updated successfully`, data: response });
    }
    catch (error) {
        console.error(`error in updating principal:`, error.message);
        res.status(500).json({ message: `Error while updating principal`, error: error.message });
    }
});
exports.updatePrinicpalController = updatePrinicpalController;
const getAllByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const numericId = Number(id);
        if (!id || isNaN(numericId) || !Number.isInteger(numericId) || numericId <= 0) {
            res.status(400).json({ error: `Id is required and must be a positive integer` });
            return;
        }
        const response = yield (0, principalService_1.getAllByIdService)(Number(id));
        if (!response) {
            res.status(404).json({ error: `Id not found or Fetching failed` });
            return;
        }
        res.status(200).json({ message: `Principal and child data fetched succuessfully`, data: response });
    }
    catch (error) {
        console.error(`error in fetching principal and child data:`, error.message);
        res.status(500).json({ message: `Error while updating principal`, error: error.message });
    }
});
exports.getAllByIdController = getAllByIdController;
const deletePrincipalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: `Id is required` });
            return;
        }
        const response = yield (0, principalService_1.deletePrincipal)(Number(id));
        if (!response) {
            res.status(404).json({ error: `Id not found or delete failed` });
            return;
        }
        res.status(200).json({ message: `Principal and child data deleted succuessfully` });
        // res.status(200).json({message: `Principal and child data deleted succuessfully`, data: response});
    }
    catch (error) {
        console.error(`error in deleting principal and child data: (controller)`, error.message);
        res.status(500).json({ message: `Error while deleting principal`, error: error.message });
    }
});
exports.deletePrincipalController = deletePrincipalController;
