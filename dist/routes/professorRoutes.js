"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const professorController_1 = require("../controller/professorController");
const router = express_1.default.Router();
router.post('/addprofessor', professorController_1.addProfessorController);
router.get('/getprofessor', professorController_1.getProfessorsController);
router.get('/getprofessorbyid/:id', professorController_1.getProfessorByIdController);
router.put('/updateprofessor/:id', professorController_1.updateProfessorController);
router.get('/getallbyid/:id', professorController_1.getAllProfByIdController);
router.delete('/deleteprofessor/:id', professorController_1.deleteProfessorController);
exports.default = router;
