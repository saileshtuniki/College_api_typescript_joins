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
exports.deletePrincipal = exports.getAllByIdService = exports.serviceupdatePrincipal = exports.getPrincipalById = exports.getPrincipal = exports.addPrincipal = void 0;
const principalRepository_1 = require("../repository/principalRepository");
const addPrincipal = (name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!name) {
            throw new Error(` Name is required`);
        }
        const result = yield (0, principalRepository_1.insertPrincipal)(name);
        return result;
    }
    catch (error) {
        throw new Error(`Error in adding Principal: ${error.message}`);
    }
});
exports.addPrincipal = addPrincipal;
const getPrincipal = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, principalRepository_1.fetchPrincipal)();
        return result;
    }
    catch (error) {
        throw new Error(`Error in getting principal: ${error.message}`);
    }
});
exports.getPrincipal = getPrincipal;
const getPrincipalById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error(` Id is required`);
        }
        return yield (0, principalRepository_1.fetchprincipalById)(id);
    }
    catch (error) {
        throw new Error(`Error in fetching principal by Id: ${error.message}`);
    }
});
exports.getPrincipalById = getPrincipalById;
const serviceupdatePrincipal = (id, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id || !name) {
            throw new Error('ID and Name are required');
        }
        const result = yield (0, principalRepository_1.updatePrincipal)(id, name);
        if (!result) {
            throw new Error('Principal not found or update has failed');
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error updating principal:${error.message}`);
    }
});
exports.serviceupdatePrincipal = serviceupdatePrincipal;
const getAllByIdService = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error('ID is required');
        }
        const result = yield (0, principalRepository_1.fetchAllById)(id);
        if (!result) {
            throw new Error(`Data not found (Service)`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in fetching data from principal: ${error.message}`);
    }
});
exports.getAllByIdService = getAllByIdService;
const deletePrincipal = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!id) {
            throw new Error('ID is required');
        }
        const result = yield (0, principalRepository_1.deleteAllById)(id);
        if (!result) {
            throw new Error(`No matching ID found to delete (Service)`);
        }
        return result;
    }
    catch (error) {
        throw new Error(`Error in deleteing data from principal and child (service): ${error.message}`);
    }
});
exports.deletePrincipal = deletePrincipal;
