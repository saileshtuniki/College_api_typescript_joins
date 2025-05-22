"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const hodServices = __importStar(require("../../service/hodService"));
const app_1 = require("../../app");
const supertest_1 = __importDefault(require("supertest"));
const dbConnect_1 = __importDefault(require("../../config/dbConnect"));
jest.mock('../../service/hodService');
describe('Hod Controller Tests', () => {
    describe('POST(addHodController)', () => {
        beforeAll(() => {
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
            yield dbConnect_1.default.end();
        }));
        //55 test case is from Hod controller
        it('it should return status of 400 when name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.app).post('/api/hod/addhod').send({ parentId: 1 });
            //    (hodServices.addHod as jest.Mock).mockResolvedValue(null);
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: `name and parent_id are required`,
            });
        }));
        it('it should return status of 400 if parentId is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.app).post('/api/hod/addhod').send({ name: 'test hod' });
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: `name and parent_id are required`,
            });
        }));
        //57
        it('it should return status of 400 if name and parentId are missing', () => __awaiter(void 0, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(app_1.app).post('/api/hod/addhod').send({});
            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: `name and parent_id are required`,
            });
        }));
        it('it should return the status of 200, when added hod', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHodDetails = { id: 2, name: 'test hod', role: 'Hod', parentId: 1 };
            hodServices.addHod.mockResolvedValue(mockHodDetails);
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/hod/addhod').send(mockHodDetails);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: `HOD added successfully`,
                data: mockHodDetails
            });
        }));
        it("it should return 500 if there is service error", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error("Service failure");
            hodServices.addHod.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app)
                .post("/api/hod/addhod")
                .send({ name: "test hod", parentId: 1 });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Error while adding Hod",
                error: mockError.message,
            });
        }));
    });
    describe('getHodController', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should return status 200 for get hod details', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHod = [
                { id: 20, name: 'test hod 1', parentId: 1 },
                { id: 3, name: 'test hod 2', parentId: 1 }
            ];
            hodServices.getHod.mockResolvedValue(mockHod);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/gethod');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockHod);
        }));
        it("it should return 500 if there is service error", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error("Service failure");
            hodServices.getHod.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).get("/api/hod/gethod");
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: "Error in getting hod data (controller)",
                error: mockError.message,
            });
        }));
    });
    describe('getHodByIdController ', () => {
        beforeAll(() => {
            // Prevent console logs/errors from cluttering the test output.
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        beforeEach(() => {
            // Clear mocks after each test.
            jest.clearAllMocks();
        });
        it('it should return status 400 when invalid id format', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/gethodbyid/xyz');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: `Invalid id format (controller)`
            });
        }));
        it('should return status 404 if hod with given id is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            hodServices.getHodById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/gethodbyid/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: `Hod with 1 not found (controller)`
            });
        }));
        it('it should return 200 status code and hod details by Id', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockHodDetails = { id: 7, name: 'Test hod 1' };
            hodServices.getHodById.mockResolvedValue(mockHodDetails);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/gethodbyid/7');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: `Hod of id: 7`,
                data: mockHodDetails
            });
        }));
        it("returns 500 if the service throws", () => __awaiter(void 0, void 0, void 0, function* () {
            hodServices.getHodById.mockRejectedValue(new Error("DB offline"));
            const res = yield (0, supertest_1.default)(app_1.app).get("/api/hod/gethodbyid/5");
            // expect(hodServices.getHodById).toHaveBeenCalledWith(5);
            expect(res.status).toBe(500);
            expect(res.body).toEqual({
                success: false,
                message: `Error in getting Hod (controller)`,
                error: "DB offline",
            });
        }));
    });
    describe('updateHodController', () => {
        beforeAll(() => {
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        beforeEach(() => {
            jest.clearAllMocks();
        });
        it('it should return 400 if name and id is not given or invalibodyd', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/hod/updatehodbyid/abc');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: `Id and name are required` });
        }));
        it('it should return 404 if principal not found or update failed', () => __awaiter(void 0, void 0, void 0, function* () {
            hodServices.ServiceUpdateHod.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/hod/updatehodbyid/1').send({ name: 'update hod 1' });
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: `Hod not found or update failed`
            });
        }));
        it("it should return 200 if the details have been updated", () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedHodDetails = { id: 1, name: "updated hod name" };
            hodServices.ServiceUpdateHod.mockResolvedValue(mockUpdatedHodDetails);
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/hod/updatehodbyid/1').send(mockUpdatedHodDetails);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: "hod upadated successfully",
                data: mockUpdatedHodDetails,
            });
        }));
        it('it should return 500 id there is any service error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Update failed');
            hodServices.ServiceUpdateHod.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/hod/updatehodbyid/1').send({ name: 'Updated hod name' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'error while updating Hod',
                error: 'Update failed'
            });
        }));
    });
    describe('getAllHodByIdController', () => {
        beforeAll(() => {
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('it return 400 if id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const resposne = yield (0, supertest_1.default)(app_1.app).get('/api/hod/getallbyid/');
            expect(resposne.status).toBe(400);
            expect(resposne.body).toEqual({
                error: 'Id is required'
            });
        }));
        it('it should return 404 if id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            hodServices.getAllHodById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/getallbyid/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Hod not found or fetching failed' });
        }));
        it('it should return 200 if data fetched successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockgetAllById = { id: 1, name: 'hod name' };
            hodServices.getAllHodById.mockResolvedValue(mockgetAllById);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/getallbyid/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(`data fetched successfully`);
            expect(response.body.data).toEqual(mockgetAllById);
        }));
        it('it should ewturn 500 if there is any server error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Get failed');
            hodServices.getAllHodById.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/hod/getallbyid/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'error while fetching Hod',
                error: 'Get failed'
            });
        }));
    });
    describe('deleteHodController ', () => {
        beforeAll(() => {
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('it should return 400 if Id is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app).delete('/api/hod/deletehod/');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Id is required'
            });
        }));
        it('it should return 404 if id is not found or invalid id', () => __awaiter(void 0, void 0, void 0, function* () {
            hodServices.deleteHod.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).delete('/api/hod/deletehod/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: 'Id not found or delete failed'
            });
        }));
        it('it should return status of 200 if deletion successfull', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockDeleteHod = { id: 1, name: 'Test hod name' };
            hodServices.deleteHod.mockResolvedValue(mockDeleteHod);
            const response = yield (0, supertest_1.default)(app_1.app).delete('/api/hod/deletehod/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Hod and related child data deleted succuessfully'
            });
        }));
        it('it should return 500 status code or error message', () => __awaiter(void 0, void 0, void 0, function* () {
            const errorMessage = 'delete failed';
            hodServices.deleteHod.mockRejectedValue(new Error(errorMessage));
            const response = yield (0, supertest_1.default)(app_1.app).delete('/api/hod/deletehod/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: `Error while deleting Hod`,
                error: errorMessage
            });
        }));
    });
});
