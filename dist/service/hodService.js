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
exports.deleteHod = exports.getAllHodById = exports.ServiceUpdateHod = exports.getHodById = exports.getHod = exports.addHod = void 0;
const hodRepository_1 = require("../repository/hodRepository");
const addHod = (name, parentId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!name || !parentId === undefined) {
            throw new Error(`Name and parentId are required`);
        }
        const result = yield (0, hodRepository_1.insertHod)(name, parentId);
        console.log(`Inserted Hod data`, result);
        return result;
    }
    catch (error) {
        console.error(`error in adding function:`, error.message);
        throw error; // this error will pass to controller
    }
});
exports.addHod = addHod;
const getHod = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const result = await fetchHod();
        // return result;
        return yield (0, hodRepository_1.fetchHod)();
    }
    catch (error) {
        throw new Error(`Fetching data of Hod has failed (service) ${error.message}`);
    }
});
exports.getHod = getHod;
const getHodById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error(`Id is required`);
        }
        return yield (0, hodRepository_1.fetchHodById)(id);
    }
    catch (error) {
        throw new Error(`Error in fetching Hod by id: ${id}`);
    }
});
exports.getHodById = getHodById;
const ServiceUpdateHod = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id || !name) {
            throw new Error(`Id and name are required (service)`);
        }
        const result = yield (0, hodRepository_1.updateHodRepository)(id, name);
        if (!result) {
            throw new Error(`Hod not found or update has failed`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error updating Hod:${error.message}`);
    }
});
exports.ServiceUpdateHod = ServiceUpdateHod;
const getAllHodById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error(`Id is required (service)`);
        }
        const result = yield (0, hodRepository_1.fetchAllHodById)(id);
        if (!result) {
            throw new Error(`Hod not found or fetching has failed`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in fetching Hod:${error.message}`);
    }
});
exports.getAllHodById = getAllHodById;
const deleteHod = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error('ID is required');
        }
        const result = yield (0, hodRepository_1.deleteAllHodById)(id);
        if (!result) {
            throw new Error(`No matching ID found to delete (Service)`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in deleteing data from Hod and related child data (service): ${error.message}`);
    }
});
exports.deleteHod = deleteHod;
