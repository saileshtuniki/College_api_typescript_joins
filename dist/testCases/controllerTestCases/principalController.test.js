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
const principalService_1 = require("./../../service/principalService");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app");
// import * as principalServices from '../../service/principalService'
const principalService_2 = require("../../service/principalService");
// import {pool} from '../../app';
const dbConnect_1 = __importDefault(require("../../config/dbConnect"));
jest.mock('../../service/principalService');
describe('Principal Controller Tests', () => {
    describe('POST (addPrincipalController)', () => {
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
        it('it should return status of 400 when the name is missing', () => __awaiter(void 0, void 0, void 0, function* () {
            // const newPrincipal = {name: 'Test Principal'};
            // const mcokCreatedPrinicpal = {id:1, newPrincipal};
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/principal/addprincipal').send({});
            principalService_2.addPrincipal.mockResolvedValue(null);
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Name is not Provided' });
        }));
        it('it should create a principal and return status of 200', () => __awaiter(void 0, void 0, void 0, function* () {
            const newPrincipal = { name: 'Test Principal' };
            const mockCreatedPrinicpal = Object.assign({ id: 1 }, newPrincipal);
            principalService_2.addPrincipal.mockResolvedValue(mockCreatedPrinicpal);
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/principal/addprincipal').send(newPrincipal);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message: 'Principal added successfully',
                data: mockCreatedPrinicpal,
            });
        }));
        it('it should return 500 if there is service error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Service failure');
            principalService_2.addPrincipal.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).post('/api/principal/addprincipal').send({ name: 'Test principal' });
            // jest.spyOn('addPricipal').mockRejectedValue(mockError);
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error in adding principal',
                error: mockError.message
            });
        }));
    });
    describe('GET (getPrincipalController)', () => {
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('it should get principal details', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPrincipal = { id: 1, name: "Test Prinicpal" };
            principalService_1.getPrincipal.mockResolvedValue(mockPrincipal);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getprincipal');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Principal fetched successfully',
                data: mockPrincipal
            });
        }));
        it('it should return 500 error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Service failure');
            principalService_1.getPrincipal.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getprincipal');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error in getting principal',
                // error: mockError.message
            });
        }));
    });
    describe('GET /api/principal/getbyid/:id', () => {
        beforeAll(() => {
            // Prevent console logs/errors from cluttering the test output.
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        afterEach(() => {
            // Clear mocks after each test.
            jest.clearAllMocks();
        });
        it('should return status 400 for invalid id format', () => __awaiter(void 0, void 0, void 0, function* () {
            // Sending a non-numeric value triggers isNaN check in the controller.
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getbyid/invalid');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ message: 'Invalid Id format' });
        }));
        it('should return status 404 if principal with given id is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            // Set up the service mock to return null for a non-existing principal.
            principalService_1.getPrincipalById.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getbyid/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Principal with id not found' });
        }));
        it('should return status 200 and principal details if found', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockPrincipal = { id: 1, name: 'Test Principal' };
            // Set up the service mock to return a valid principal.
            principalService_1.getPrincipalById.mockResolvedValue(mockPrincipal);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getbyid/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                messsage: 'Principal of id: % 1', // Note: The key "messsage" must match the controller code.
                data: mockPrincipal,
            });
        }));
        it('should return status 500 in case of a service error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Service error');
            // Cause the service to throw an error.
            principalService_1.getPrincipalById.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getbyid/1');
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error in getting principal',
            });
        }));
    });
    describe('PUT update the principal details', () => {
        beforeAll(() => {
            jest.spyOn(console, 'log').mockImplementation(() => { });
            jest.spyOn(console, 'error').mockImplementation(() => { });
        });
        afterEach(() => {
            jest.clearAllMocks();
        });
        it('it should return 400 if id and name is not given or invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/principal/updateprincipal/invalid').send({});
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'Id and name are required' });
        }));
        it('it should return 404 if prinicpal not found or update failed', () => __awaiter(void 0, void 0, void 0, function* () {
            principalService_1.serviceupdatePrincipal.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/principal/updateprincipal/1').send({ name: 'Test name' });
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('principal not found or update failed');
        }));
        it('it should return 200 if the details have been updated', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUpdatedDetails = { id: 1, name: 'new name' };
            principalService_1.serviceupdatePrincipal.mockResolvedValue(mockUpdatedDetails);
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/principal/updateprincipal/1').send(mockUpdatedDetails);
            expect(response.status).toBe(200);
            expect(response.body.message).toEqual('Principal updated successfully');
            // expect(response.body.data).toEqual(response);
        }));
        it('it should return 500 id there is any service error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Update failed');
            principalService_1.serviceupdatePrincipal.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).put('/api/principal/updateprincipal/1').send({ name: 'Updated principal' });
            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                message: 'Error while updating principal',
                error: 'Update failed'
            });
        }));
    });
    describe('GET getAllByIdController to get all details in a tree format', () => {
        it('it should return 400 if id not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            // (getAllByIdService as jest.Mock).mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getallbyid/invalid');
            expect(response.status).toBe(400);
            // expect(response.body).toEqual({error:'Id is required'});
            expect(response.body).toEqual({ error: 'Id is required and must be a positive integer' });
        }));
        it('it should return 404 if id not provided', () => __awaiter(void 0, void 0, void 0, function* () {
            principalService_1.getAllByIdService.mockResolvedValue(null);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getallbyid/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Id not found or Fetching failed' });
        }));
        it('it should return 200 if data fetched successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockgetAllById = { id: 1, name: 'Test name' };
            principalService_1.getAllByIdService.mockResolvedValue(mockgetAllById);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getallbyid/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe(`Principal and child data fetched succuessfully`);
            expect(response.body.data).toEqual(mockgetAllById);
        }));
        it('it should ewturn 500 if there is any server error', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockError = new Error('Get failed');
            principalService_1.getAllByIdService.mockRejectedValue(mockError);
            const response = yield (0, supertest_1.default)(app_1.app).get('/api/principal/getallbyid/1');
            expect(response.status).toBe(500);
            // expect(response.body.message).toBe('Error while updating principal');
            // expect(response.body.error).toBe('Get failed');
            expect(response.body).toEqual({
                message: 'Error while updating principal',
                error: 'Get failed'
            });
        }));
    });
});
