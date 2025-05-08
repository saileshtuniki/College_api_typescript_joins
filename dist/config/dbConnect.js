"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
require("dotenv/config");
const { Pool } = pg_1.default;
const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: Number(process.env.DB_PORT),
});
// Verify connection immediately
if (process.env.NODE_ENV !== "test") {
    pool.connect()
        .then(() => {
        console.log('Database connection successful!');
    })
        .catch(err => {
        console.error('Failed to connect to the database:', err.message);
    });
}
exports.default = pool;
