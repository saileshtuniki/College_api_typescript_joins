"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const principalController_1 = require("../controller/principalController");
const router = express_1.default.Router();
router.post('/addprincipal', principalController_1.addPrincipalController);
router.get('/getprincipal', principalController_1.getPrincipalController);
router.get('/getbyid/:id', principalController_1.getPrincipalByIdController);
router.put('/updateprincipal/:id', principalController_1.updatePrinicpalController);
router.get('/getallbyid/:id', principalController_1.getAllByIdController);
router.delete('/deleteprincipal/:id', principalController_1.deletePrincipalController);
exports.default = router;
