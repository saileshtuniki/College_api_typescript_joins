"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const principalRoutes_1 = __importDefault(require("./principalRoutes"));
const hodRoutes_1 = __importDefault(require("./hodRoutes"));
const professorRoutes_1 = __importDefault(require("./professorRoutes"));
const studentRoutes_1 = __importDefault(require("./studentRoutes"));
const router = express_1.default.Router();
router.use('/principal', principalRoutes_1.default);
router.use('/hod', hodRoutes_1.default);
router.use('/professor', professorRoutes_1.default);
router.use('/student', studentRoutes_1.default);
exports.default = router;
