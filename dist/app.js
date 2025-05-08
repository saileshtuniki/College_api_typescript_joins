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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = exports.app = void 0;
// import { JsonObject } from './../node_modules/@types/swagger-ui-express/index.d';
// import { QueryResult } from './../node_modules/@types/pg/index.d';
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger/swagger.json"));
dotenv_1.default.config();
// type QueryResult = {now: string};
const app = (0, express_1.default)();
exports.app = app;
// const PORT : number = Number(process.env.PORT) || 8000;
const pool = new pg_1.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
});
exports.pool = pool;
app.use(express_1.default.json());
// Server Swagger Docs
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use('/api', index_1.default);
app.get('/testconnection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield pool.query(`SELECT NOW()`);
        res.status(200).json({
            success: true,
            message: `Database connection successfully`,
            current_time: result.rows[0].now,
        });
    }
    catch (error) {
        console.error(`Database connection failed`, error.message);
        res.status(500).json({
            success: false,
            message: `Database connection failed`,
            error: error.message,
        });
    }
}));
// {
//     "compilerOptions": {
//       "resolveJsonModule": true,
//       "esModuleInterop": true,
//       "allowSyntheticDefaultImports": true,
//       "moduleResolution": "node"
//     }
//   }
