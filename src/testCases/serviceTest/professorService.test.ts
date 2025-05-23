import { addProfessor, getProfessor , getProfessorById, serviceUpdateProfessor, getAllProfById ,deleteProfessor} from "../../service/professorService";
import * as professorRepository from "../../repository/professorRepository";

jest.mock("../../repository/professorRepository");

describe("addProfessor", () => {
    afterEach(()=>{
            jest.clearAllMocks();
        })

    beforeEach(()=>{
        jest.clearAllMocks();

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })

    it("should add a professor successfully", async () => {
        (professorRepository.insertProfessor as jest.Mock).mockResolvedValueOnce({ id: 1, name: "Dr. John", parentId: 2 });

        const result = await addProfessor("Dr. John", 2);
        expect(result).toEqual({ id: 1, name: "Dr. John", parentId: 2 });
    });

    it("should throw an error when required fields are missing", async () => {
        await expect(addProfessor("", 2)).rejects.toThrow("Name and Parent ID are required");
        expect(professorRepository.insertProfessor).not.toHaveBeenCalled();
    });

    it("should handle repository errors gracefully", async () => {
        (professorRepository.insertProfessor as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

        await expect(addProfessor("Dr. John", 2)).rejects.toThrow("Failed to add professor");
    });
});




describe("getProfessor", () => {
    it("should return list of professors", async () => {
        (professorRepository.fetchProfessor as jest.Mock).mockResolvedValueOnce([{ id: 1, name: "Dr. John" }]);

        const result = await getProfessor();
        expect(result).toEqual([{ id: 1, name: "Dr. John" }]);
    });

    it("should handle repository errors gracefully", async () => {
        (professorRepository.fetchProfessor as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

        await expect(getProfessor()).rejects.toThrow("Failed to fetch professors");
    });
});




describe("getProfessorById", () => {

    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })

    it("should return professor data when found", async () => {
        (professorRepository.fetchProfessorById as jest.Mock).mockResolvedValueOnce({ id: 2, name: "Dr. Alice" });

        const result = await getProfessorById(2);
        expect(result).toEqual({ id: 2, name: "Dr. Alice" });
    });

    it("should throw error when ID is missing", async () => {
        await expect(getProfessorById(undefined as any)).rejects.toThrow("ID is required");
    });

    it("should handle repository errors gracefully", async () => {
        (professorRepository.fetchProfessorById as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

        await expect(getProfessorById(2)).rejects.toThrow("Failed to fetch professor by ID");
    });
});




describe("serviceUpdateProfessor", () => {

    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })

    it("should update professor data successfully", async () => {
        (professorRepository.updateProfessor as jest.Mock).mockResolvedValueOnce({ id: 2, name: "Dr. Alice Updated" });

        const result = await serviceUpdateProfessor(2, "Dr. Alice Updated");
        expect(result).toEqual({ id: 2, name: "Dr. Alice Updated" });
    });

    it("should throw error when ID or name is missing", async () => {
        await expect(serviceUpdateProfessor(2, "")).rejects.toThrow("ID and Name are required");
    });

    it("should handle repository errors gracefully", async () => {
        (professorRepository.updateProfessor as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

        await expect(serviceUpdateProfessor(2, "Dr. Alice Updated")).rejects.toThrow("Failed to update professor");
    });
});



describe("getAllProfById", () => {
    it("should return professor hierarchy when found", async () => {
        const mockData = {
          message: "Professor data fetched successfully",
          data: {
            fetchallprofessorbyid: {
              professor_id: 2,
              professor_name: "Dr. Kiran",
              students: [
                {
                  student_id: 2,
                  student_name: "Vamshi",
                },
              ],
            },
          },
        };

        (professorRepository.fetchAllProfById as jest.Mock).mockResolvedValueOnce(mockData);

        const result = await getAllProfById(2);
        expect(result).toEqual(mockData);
    });

    it("should throw error when ID is missing", async () => {
        await expect(getAllProfById(undefined as any)).rejects.toThrow("Id is required");
    });

    it("should throw error when professor is not found", async () => {
        (professorRepository.fetchAllProfById as jest.Mock).mockResolvedValueOnce(null);

        await expect(getAllProfById(99)).rejects.toThrow("Professor not Found");
    });

    it("should handle repository errors gracefully", async () => {
        (professorRepository.fetchAllProfById as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

        await expect(getAllProfById(2)).rejects.toThrow("Error in fetching Professor: Database failure");
    });
});





describe("deleteProfessor", () => {
    it("should delete professor successfully", async () => {
        (professorRepository.deleteAllProfessorById as jest.Mock).mockResolvedValueOnce(true);

        const result = await deleteProfessor(2);
        expect(result).toBe(true);
    });

    it("should throw error when ID is missing", async () => {
        await expect(deleteProfessor(undefined as any)).rejects.toThrow("Professor ID is required");
    });

    it("should throw error when professor is not found", async () => {
        (professorRepository.deleteAllProfessorById as jest.Mock).mockResolvedValueOnce(false);

        await expect(deleteProfessor(99)).rejects.toThrow("No matching ID found to delete (service)");
    });

    it("should handle repository errors gracefully", async () => {
        (professorRepository.deleteAllProfessorById as jest.Mock).mockRejectedValueOnce(new Error("Database failure"));

        await expect(deleteProfessor(2)).rejects.toThrow("Error in deleting data from professor and related child data(service), Database failure");
    });
});
