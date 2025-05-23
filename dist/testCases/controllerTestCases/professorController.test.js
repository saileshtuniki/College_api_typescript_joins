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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../../app"); // Assuming Express instance is imported
const professorService = __importStar(require("../../service/professorService"));
jest.mock("../../service/professorService");
describe("addProfessorController", () => {
    it("should return 201 when professor is added", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.addProfessor.mockResolvedValueOnce({ id: 1, name: "Dr. John", parentId: 2 });
        const response = yield (0, supertest_1.default)(app_1.app)
            .post("/api/professor/addprofessor")
            .send({ name: "Dr. John", parentId: 2 });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Professor added successfully");
        expect(response.body.data).toEqual({ id: 1, name: "Dr. John", parentId: 2 });
    }));
    it("should return 400 when required fields are missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).post("/api/professor/addprofessor").send({});
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Name and Parent ID are required");
    }));
    it("should return 500 on service error", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.addProfessor.mockRejectedValueOnce(new Error("Service failure"));
        const response = yield (0, supertest_1.default)(app_1.app).post("/api/professor/addprofessor").send({ name: "Dr. John", parentId: 2 });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Cannot add Professor");
    }));
});
describe("getProfessorsController", () => {
    it("should return 200 with professor list", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getProfessor.mockResolvedValueOnce([{ id: 1, name: "Dr. John" }]);
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getprofessor");
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: "Dr. John" }]);
    }));
    it("should return 500 on service error", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getProfessor.mockRejectedValueOnce(new Error("Service failure"));
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getprofessor");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
    }));
});
describe("getProfessorByIdController", () => {
    it("should return 200 when professor is found", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getProfessorById.mockResolvedValueOnce({ id: 2, name: "Dr. Alice" });
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getprofessorbyid/2");
        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({ id: 2, name: "Dr. Alice" });
    }));
    it("should return 404 when professor is not found", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getProfessorById.mockResolvedValueOnce(null);
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getprofessorbyid/99");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Professor with 99 not found (controller)");
    }));
    it("should return 400 for invalid ID", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getprofessorbyid/xyz");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    }));
    it("should return 500 when service encounters an error", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getProfessorById.mockRejectedValueOnce(new Error("Database failure"));
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getprofessorbyid/2");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
        expect(response.body.error).toBe("Database failure");
    }));
});
describe("updateProfessorController", () => {
    it("should return 200 when professor is updated", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.serviceUpdateProfessor.mockResolvedValueOnce({ id: 2, name: "Dr. Alice Updated" });
        const response = yield (0, supertest_1.default)(app_1.app).put("/api/professor/updateprofessor/2").send({ name: "Dr. Alice Updated" });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Professor updated successfully");
        expect(response.body.data).toEqual({ id: 2, name: "Dr. Alice Updated" });
    }));
    it("should return 400 for invalid input", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).put("/api/professor/updateprofessor/xyz").send({ name: "" });
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Valid ID and Name are required");
    }));
    it("should return 500 on service error", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.serviceUpdateProfessor.mockRejectedValueOnce(new Error("Service failure"));
        const response = yield (0, supertest_1.default)(app_1.app).put("/api/professor/updateprofessor/2").send({ name: "Dr. Alice Updated" });
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
    }));
});
describe("getAllProfByIdController", () => {
    const mockAllProfessorByIdData = {
        message: "Professor data fetched successfully",
        data: {
            fetchallprofessorbyid: {
                professor_id: 2,
                professor_name: "Dr. Kiran",
                students: [
                    {
                        student_id: 2,
                        student_name: "Vamshi"
                    }
                ]
            }
        }
    };
    it("should return 200 with professor hierarchy", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getAllProfById.mockResolvedValueOnce(mockAllProfessorByIdData);
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getallbyid/2");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Professor data fetched successfully");
    }));
    it("should return 400 when ID is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getallbyid/all/");
        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Id is required");
    }));
    it("should return 500 on service error", () => __awaiter(void 0, void 0, void 0, function* () {
        professorService.getAllProfById.mockRejectedValueOnce(new Error("Service failure"));
        const response = yield (0, supertest_1.default)(app_1.app).get("/api/professor/getallbyid/2");
        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
    }));
});
