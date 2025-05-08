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
exports.deleteHodController = exports.getAllHodByIdController = exports.updateHodController = exports.getHodByIdController = exports.getHodController = exports.addHodController = void 0;
const hodService_1 = require("../service/hodService");
// getHod, getHodById, serviceUpdateHod
const addHodController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, parentId } = req.body;
    try {
        if (!name || !parentId === undefined) {
            res.status(400).json({
                success: false,
                message: `name and parent_id are required`
            });
            return;
        }
        const response = yield (0, hodService_1.addHod)(name, parentId);
        res.status(201).json({
            message: `HOD added successfully`,
            data: response
        });
        return;
    }
    catch (error) {
        console.error(`error in adding Hod (controller)`, error.message);
        res.status(500).json({ message: ` Error while adding Hod`, error: error.message });
    }
});
exports.addHodController = addHodController;
const getHodController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield (0, hodService_1.getHod)();
        res.status(200).json(response);
    }
    catch (error) {
        res.status(400).json({
            message: 'Error in getting hod data (controller)',
            error: error.message
        });
    }
});
exports.getHodController = getHodController;
const getHodByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: `Invalid id format (controller)` });
            return;
        }
        const response = yield (0, hodService_1.getHodById)(id);
        if (!response) {
            res.status(404).json({ error: `Hod with ${id} not found (controller)` });
        }
        res.status(200).json({ success: true, message: `Hod of id: ${id}`, data: response });
    }
    catch (error) {
        console.error(`Error in getting hod`);
        res.status(500).json({
            success: false,
            message: (`Error in getting Hod (controller)`),
            error: error.message
        });
    }
});
exports.getHodByIdController = getHodByIdController;
const updateHodController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id || !name) {
            res.status(400).json({ error: `Id and name are required` });
            return;
        }
        // Log the values to ensure they're being passed correctly
        console.log(`Updating hod with id: ${id}, name: ${name}`);
        const response = yield (0, hodService_1.ServiceUpdateHod)(Number(id), name);
        if (!response) {
            res.status(404).json({ error: `Hod not found or update failed` });
            return;
        }
        res.status(200).json({ message: `hod upadated successfully`, data: response });
    }
    catch (error) {
        console.error(`error in updating hod:`, error.message);
        res.status(500).json({ message: `error while updating Hod`, error: error.message });
    }
});
exports.updateHodController = updateHodController;
const getAllHodByIdController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: `Id is required` });
        }
        const response = yield (0, hodService_1.getAllHodById)(Number(id));
        if (!response) {
            res.status(404).json({ error: `Hod not found or fetching failed` });
            return;
        }
        res.status(200).json({ message: `data fetched successfully`, data: response });
    }
    catch (error) {
        console.error(`error in fetching hod and child elements:`, error.message);
        res.status(500).json({ message: `error while fetching Hod`, error: error.message });
    }
});
exports.getAllHodByIdController = getAllHodByIdController;
const deleteHodController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: `Id is required` });
            return;
        }
        const response = yield (0, hodService_1.deleteHod)(Number(id));
        if (!response) {
            res.status(404).json({ error: `Id not found or delete failed` });
            return;
        }
        res.status(200).json({ message: `Hod and related child data deleted succuessfully` });
        // res.status(200).json({message: `Principal and child data deleted succuessfully`, data: response});
    }
    catch (error) {
        console.error(`error in deleting Hod and related child data: (controller)`, error.message);
        res.status(500).json({ message: `Error while deleting Hod`, error: error.message });
    }
});
exports.deleteHodController = deleteHodController;
