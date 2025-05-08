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
exports.addPrincipalController = void 0;
const principalService_1 = require("../service/principalService");
const addPrincipalController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ message: `Name is not Provided` });
            return;
        }
        const response = yield (0, principalService_1.addPrincipal)(name);
        res.status(200).json({
            success: true,
            message: 'Principal added successfully',
            data: response
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
