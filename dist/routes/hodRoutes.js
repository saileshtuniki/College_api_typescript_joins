"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const hodController_1 = require("../controller/hodController");
router.post('/addhod', hodController_1.addHodController);
router.get('/gethod', hodController_1.getHodController);
router.get('/gethodbyid/:id', hodController_1.getHodByIdController);
router.put('/updatehodbyid/:id', hodController_1.updateHodController);
router.get('/getallbyid/:id', hodController_1.getAllHodByIdController);
router.delete('/deletehod/:id', hodController_1.deleteHodController);
exports.default = router;
