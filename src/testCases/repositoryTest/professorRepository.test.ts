// professorRepository.test.ts

import { Professor, ProfessorResponse } from "../../exportInterfaces/professorInterface";

// Mock the database pool so the real database isn’t affected.
jest.mock("../../config/dbConnect", () => ({
    query: jest.fn(),
}));

// Import the pool after mocking.
import pool from "../../config/dbConnect";
import * as ProfRepo from "../../repository/professorRepository";
import professorQueries from "../../queries/professorSqlQueries";

describe("Repository layer Test cases for professorRepository", () => {
  
  beforeEach(() => {
    // Optional: spy on console methods if you want to suppress output.
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("insertProfessor", () => {
    it("should insert professor successfully", async () => {
      // Define a fake professor to be returned by the SELECT query.
      const newProfessor: Professor = { id: 1, name: "Dr. Sam", parentId: 2 };

      // First call: simulate procedure call (no rows needed).
      // Second call: simulate fetching the inserted professor.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({rows: []}) // call to professorQueries.addProfessorProc
        .mockResolvedValueOnce({ rows: [newProfessor] }); // call to SELECT query

      const result = await ProfRepo.insertProfessor(newProfessor.name, newProfessor.parentId);
      expect(result).toEqual(newProfessor);

      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        professorQueries.addProfessorProc,
        [newProfessor.name, newProfessor.parentId]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        `select * from Professor where name= $1 and hodId=$2 order by id DESC LIMIT 1`,
        [newProfessor.name, newProfessor.parentId]
      );
    });

    it("should throw an error if SELECT finds no rows", async () => {
      // First call (procedure) – returns an empty object.
      // Second call (SELECT) – returns no rows.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({rows:[]}) 
        .mockResolvedValueOnce({ rows: [] });

      await expect(ProfRepo.insertProfessor("X", 3)).rejects.toThrow("Professor insertion failed");
      expect(pool.query).toHaveBeenCalledTimes(2);
    });
    
    it("should handle thrown errors from pool.query gracefully", async () => {
      const errorMessage = "Database error";
      (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

      await expect(ProfRepo.insertProfessor("Any", 2)).rejects.toThrow(
        `Failed to insert professor: ${errorMessage}`
      );
      expect(pool.query).toHaveBeenCalled();
    });
  });


  describe("fetchProfessor", () => {
    it("should return list of professors (returns first row)", async () => {
      const professorsData = [{ id: 1, name: "Dr. Sam", hodId: 2 }];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: professorsData });

      const result = await ProfRepo.fetchProfessor();
      // Note: the function uses `return result.rows[0];`
      expect(result).toEqual(professorsData[0]);
      expect(pool.query).toHaveBeenCalledWith(professorQueries.professorView);
    });

    it("should handle query errors gracefully", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(ProfRepo.fetchProfessor()).rejects.toThrow("Failed to fetch professors");
    });
  });


  describe("fetchProfessorById", () => {
    it("should return professor data when found", async () => {
      const profData = { id: 2, name: "Dr. Alice", hodId: 1 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [profData] });

      const result = await ProfRepo.fetchProfessorById(2);
      expect(result).toEqual(profData);
      expect(pool.query).toHaveBeenCalledWith(professorQueries.fetchProfessorByIdFunc, [2]);
    });

    it("should handle query errors gracefully", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(ProfRepo.fetchProfessorById(2)).rejects.toThrow("Failed to fetch professor by ID");
    });
  });

  describe("updateProfessor", () => {
    it("should update professor successfully", async () => {
      const updatedProfessor = { id: 2, name: "Dr. Alice Updated", hodId: 1 };
      // First, the update procedure call returns a rowCount of 1.
      // Next, the SELECT query returns the updated record.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({ rows: [updatedProfessor] });

      const result = await ProfRepo.updateProfessor(2, "Dr. Alice Updated");
      expect(result).toEqual({
        success: true,
        message: "Professor with id:2 updated successfully",
        data: updatedProfessor,
      });
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        professorQueries.updateProfessorProc,
        [2, "Dr. Alice Updated"]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        professorQueries.fetchProfessorByIdFunc,
        [2]
      );
    });

    it("should return not found message when professor ID is not updated", async () => {
      // When update query returns rowCount of 0.
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

      const result = await ProfRepo.updateProfessor(99, "No Name");
      expect(result).toEqual({ message: "Hod with id: 99 not found" });
      expect(pool.query).toHaveBeenCalledWith(professorQueries.updateProfessorProc, [99, "No Name"]);
    });

    it("should handle update errors gracefully", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(ProfRepo.updateProfessor(2, "Dr. Alice Updated")).rejects.toThrow("Failed to update professor");
    });
  });


  describe("fetchAllProfById", () => {
    it("should return professor hierarchy when found", async () => {
      const mockData = { id: 2, name: "Dr. Sam", hodId: 1, extra: "hierarchy info" };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockData] });
      
      const result = await ProfRepo.fetchAllProfById(2);
      expect(result).toEqual(mockData);
      expect(pool.query).toHaveBeenCalledWith(professorQueries.fetchAllProfByIdFunc, [2]);
    });

    it("should return null when no professor data is found", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });
      const result = await ProfRepo.fetchAllProfById(99);
      expect(result).toBeNull();
    });

    it("should handle errors gracefully", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(ProfRepo.fetchAllProfById(2)).rejects.toThrow(
        "Error in fetching Professor and its child nodes by ID: Database error"
      );
    });
  });


  describe("deleteAllProfessorById", () => {
    it("should delete professor successfully", async () => {
      // First, check query returns rowCount: 1 (professor exists)
      // Then, deletion query is executed.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1 })
        .mockResolvedValueOnce({});
      const result = await ProfRepo.deleteAllProfessorById(2);
      expect(result).toBe(true);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        `select id from college_hierarchy_tree where id=$1`,
        [2]
      );
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        professorQueries.deleteProfessorProc,
        [2]
      );
    });

    it("should return false when professor ID does not exist", async () => {
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });
      const result = await ProfRepo.deleteAllProfessorById(99);
      expect(result).toBe(false);
      expect(pool.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`, [99]);
    });

    it("should handle deletion errors gracefully", async () => {
      (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));
      await expect(ProfRepo.deleteAllProfessorById(2)).rejects.toThrow(
        "(Repository) Error in deleting Professor by Id: Database error"
      );
    });
  });
});
