import request from "supertest";
import {app} from "../../app"; // Assuming Express instance is imported
import * as professorService from "../../service/professorService";

jest.mock("../../service/professorService");

describe("addProfessorController", () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    it("should return 201 when professor is added", async () => {
        (professorService.addProfessor as jest.Mock).mockResolvedValueOnce({ id: 1, name: "Dr. John", parentId: 2 });

        const response = await request(app)
            .post("/api/professor/addprofessor")
            .send({ name: "Dr. John", parentId: 2 });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Professor added successfully");
        expect(response.body.data).toEqual({ id: 1, name: "Dr. John", parentId: 2 });
    });

    it("should return 400 when required fields are missing", async () => {
        const response = await request(app).post("/api/professor/addprofessor").send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Name and Parent ID are required");
    });

    it("should return 500 on service error", async () => {
        (professorService.addProfessor as jest.Mock).mockRejectedValueOnce(new Error("Service failure"));

        const response = await request(app).post("/api/professor/addprofessor").send({ name: "Dr. John", parentId: 2 });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Cannot add Professor");
    });
});


describe("getProfessorsController", () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    it("should return 200 with professor list", async () => {
        (professorService.getProfessor as jest.Mock).mockResolvedValueOnce([{ id: 1, name: "Dr. John" }]);

        const response = await request(app).get("/api/professor/getprofessor");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: "Dr. John" }]);
    });

    it("should return 500 on service error", async () => {
        (professorService.getProfessor as jest.Mock).mockRejectedValueOnce(new Error("Service failure"));

        const response = await request(app).get("/api/professor/getprofessor");

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
    });
});

describe("getProfessorByIdController", () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    it("should return 200 when professor is found", async () => {
        (professorService.getProfessorById as jest.Mock).mockResolvedValueOnce({ id: 2, name: "Dr. Alice" });

        const response = await request(app).get("/api/professor/getprofessorbyid/2");

        expect(response.status).toBe(200);
        expect(response.body.data).toEqual({ id: 2, name: "Dr. Alice" });
    });

    it("should return 404 when professor is not found", async () => {
        (professorService.getProfessorById as jest.Mock).mockResolvedValueOnce(null);

        const response = await request(app).get("/api/professor/getprofessorbyid/99");

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Professor with 99 not found (controller)");
    });

    it("should return 400 for invalid ID", async () => {
        const response = await request(app).get("/api/professor/getprofessorbyid/xyz");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });


    it("should return 500 when service encounters an error", async () => {
    (professorService.getProfessorById as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app).get("/api/professor/getprofessorbyid/2");

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Server Error");
    expect(response.body.error).toBe("Database failure");
    });

});



describe("updateProfessorController", () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    it("should return 200 when professor is updated", async () => {
        (professorService.serviceUpdateProfessor as jest.Mock).mockResolvedValueOnce({ id: 2, name: "Dr. Alice Updated" });

        const response = await request(app).put("/api/professor/updateprofessor/2").send({ name: "Dr. Alice Updated" });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Professor updated successfully");
        expect(response.body.data).toEqual({ id: 2, name: "Dr. Alice Updated" });
    });

    it("should return 400 for invalid input", async () => {
        const response = await request(app).put("/api/professor/updateprofessor/xyz").send({ name: "" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Valid ID and Name are required");
    });

    it("should return 500 on service error", async () => {
        (professorService.serviceUpdateProfessor as jest.Mock).mockRejectedValueOnce(new Error("Service failure"));

        const response = await request(app).put("/api/professor/updateprofessor/2").send({ name: "Dr. Alice Updated" });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
    });
});



describe("getAllProfByIdController", () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
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
}
    it("should return 200 with professor hierarchy", async () => {
        (professorService.getAllProfById as jest.Mock).mockResolvedValueOnce(mockAllProfessorByIdData);

        const response = await request(app).get("/api/professor/getallbyid/2");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Professor data fetched successfully");
    });

    it("should return 400 when ID is missing", async () => {
        const response = await request(app).get("/api/professor/getallbyid/abc");

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Id is required");
    });

    it("should return 500 on service error", async () => {
        (professorService.getAllProfById as jest.Mock).mockRejectedValueOnce(new Error("Service failure"));

        const response = await request(app).get("/api/professor/getallbyid/2");

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Server Error");
    });
});


describe("deleteProfessorController", () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    
    it("should return 200 when professor is deleted", async () => {
        (professorService.deleteProfessor as jest.Mock).mockResolvedValueOnce(true);

        const response = await request(app).delete("/api/professor/deleteprofessor/2");

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Professor ID 2 deleted successfully");
    });

    it("should return 404 when professor is not found", async () => {
        (professorService.deleteProfessor as jest.Mock).mockResolvedValueOnce(false);

        const response = await request(app).delete("/api/professor/deleteprofessor/99");

        expect(response.status).toBe(404);
        expect(response.body.error).toBe("id not found or delete failed");
    });

    it("should return 500 on service error", async () => {
        (professorService.deleteProfessor as jest.Mock).mockRejectedValueOnce(new Error("Service failure"));

        const response = await request(app).delete("/api/professor/deleteprofessor/2");

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Cannot delete Professor");
    });
});
