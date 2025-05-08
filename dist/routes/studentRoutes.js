"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const studentController_1 = require("../controller/studentController");
const router = express_1.default.Router();
router.post('/addstudent', studentController_1.addStudentController);
router.get('/getstudent', studentController_1.getStudentsController);
router.get('/getstudentbyid/:id', studentController_1.getStudentByIdController);
router.put('/updatestudent/:id', studentController_1.updateStudentController);
router.delete('/deletestudent/:id', studentController_1.deleteStudentController);
// router.delete('/deletestudent/:id', deleteStudentController);
exports.default = router;
