import { Hod, HodResponse } from "../../exportInterfaces/hodInterface";
// mock the database , so real db wont effect
jest.mock('../../config/dbConnect', ()=> ({
    query: jest.fn(),
}));

import pool from '../../config/dbConnect'; //importing the pool after mock
import * as HodRepo from '../../repository/hodRepository';
import hodQueries from "../../queries/hodSqlQueries";

describe('Repository layer Test cases', ()=>{
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    describe('insertHod repo',()=>{
        afterEach(()=>{
            jest.clearAllMocks();
        })

        it('it should insert a Hod into database', async()=>{
            const newHod : Hod = {id: 2, name: 'Test Hod 1', parentId: 1, role: 'Hod'};

            (pool.query as jest.Mock)
            .mockResolvedValueOnce({ rows: [] })
            .mockResolvedValueOnce({ rows: [newHod] })

            // jest.spyOn(HodRepo, 'insertHod').mockResolvedValueOnce(newHod as unknown as Hod);
            const result = await HodRepo.insertHod(newHod.name, newHod.parentId);
            
            expect(result).toEqual(newHod);

            expect(pool.query).toHaveBeenNthCalledWith(
                1, hodQueries.addHodProc, [newHod.name, newHod.parentId]
            )

            expect(pool.query).toHaveBeenNthCalledWith(
                2, `SELECT * FROM Hod WHERE name = $1 AND principalId = $2 ORDER BY id DESC LIMIT 1`,
            [newHod.name, newHod.parentId])            
        });

          it("throws if SELECT finds no rows", async () => {
            // procedure runs
            (pool.query as jest.Mock)
              .mockResolvedValueOnce({ rows: [] })
              // SELECT returns empty
              .mockResolvedValueOnce({ rows: [] });

            await expect(HodRepo.insertHod("X", 5)).rejects.toThrow(
              "HOD insertion failed"
            );
            expect(pool.query).toHaveBeenCalledTimes(2);
          });

          //106 T.Case
          it('it throws error if there is query fails', async()=>{
            
            const errorMessage = 'query fails';
            (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(HodRepo.insertHod('',99)).rejects.toThrow(
                `Error in adding Hod(repository) ${errorMessage}`
            )
            expect(pool.query).toHaveBeenCalled();
          })

    });


    describe('fetchHod repository test cases',()=>{
        beforeEach(() => {
          jest.clearAllMocks();
        });

        //107
        it('it fetches the hod details',async()=>{

            const mockHodData = {id: 2, name: 'test hod 2', parentId:1 , role: 'Hod'};

            (pool.query as jest.Mock).mockResolvedValue({rows:[mockHodData]});

            const result =  await HodRepo.fetchHod();
            expect(result).toEqual(mockHodData);
            expect(pool.query).toHaveBeenCalledWith(hodQueries.hodView);
        });


        it('it should throw error if there is any query fails', async()=>{
            const errorMessage = 'query fails';
            (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

            await expect(HodRepo.fetchHod()).rejects.toThrow(
                `Error in fetching Hod details: ${errorMessage}`
            )
            expect(pool.query).toHaveBeenCalled();  
        });
    })


    describe("fetchHodById", () => {
    const mockHod = { id: 1, name: "John Doe", department: "Engineering" };

    it("should return the HOD data when found", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockHod] });

        const result = await HodRepo.fetchHodById(1);
        expect(result).toEqual(mockHod);
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchHodByIdFunc, [1]);
    });

    it("should throw an error when HOD is not found", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        await expect(HodRepo.fetchHodById(99)).rejects.toThrow("Hod not found");
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchHodByIdFunc, [99]);
    });

    it("should handle database errors gracefully", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        await expect(HodRepo.fetchHodById(2)).rejects.toThrow("Error in fetching Hod by Id: Database error");
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchHodByIdFunc, [2]);
    });
});




describe("updateHodRepository", () => {
    const mockUpdatedHod = { id: 1, name: "Updated Name", department: "Engineering" };

    it("should update the HOD and return the updated data", async () => {
        // Mock the update query to return a rowCount of 1 (successful update)
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });
        // Mock the fetch query to return updated HOD details
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockUpdatedHod] });

        const result = await HodRepo.updateHodRepository(1, "Updated Name");
        expect(result).toEqual({
            message: "Hod with id: 1 updated successfully",
            data: mockUpdatedHod,
        });
        expect(pool.query).toHaveBeenCalledWith(hodQueries.updateHodProc, [1, "Updated Name"]);
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchHodByIdFunc, [1]);
    });

    it("should return an error message when HOD is not found", async () => {
        // Mock the update query to return rowCount as 0 (meaning no record updated)
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

        const result = await HodRepo.updateHodRepository(99, "Non-existent Name");
        expect(result).toEqual({
            message: "Hod with 99 not found",
        });
        expect(pool.query).toHaveBeenCalledWith(hodQueries.updateHodProc, [99, "Non-existent Name"]);
    });

    it("should handle database errors gracefully", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        await expect(HodRepo.updateHodRepository(2, "New Name")).rejects.toThrow("Error in updating hod (repository) by Id: Database error");
        expect(pool.query).toHaveBeenCalledWith(hodQueries.updateHodProc, [2, "New Name"]);
    });
});




describe("fetchAllHodById", () => {
    const mockAllByIdData = {
        hod_id: 2,
        hod_name: "Dr. Nikhil",
        professors: [
            {
                professor_id: 2,
                professor_name: "Dr. Kiran",
                students: [
                    {
                        student_id: 2,
                        student_name: "Vamshi",
                    },
                ],
            },
        ],
    };

    it("should return the structured HOD data when found", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockAllByIdData] });

        const result = await HodRepo.fetchAllHodById(2);
        expect(result).toEqual(mockAllByIdData);
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchAllHodByIdFunc, [2]);
    });

    it("should return null when no data is found", async () => {
        (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

        const result = await HodRepo.fetchAllHodById(99);
        expect(result).toBeNull();
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchAllHodByIdFunc, [99]);
    });

    it("should handle database errors gracefully", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        await expect(HodRepo.fetchAllHodById(3)).rejects.toThrow("Error in fetching hod (repository) by Id: Database error");
        expect(pool.query).toHaveBeenCalledWith(hodQueries.fetchAllHodByIdFunc, [3]);
    });
});



describe("deleteAllHodById", () => {
    it("should return true when HOD exists and is deleted", async () => {
        // Mock the check query to return rowCount as 1 (ID exists)
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 1 });
        // Mock the delete query (doesn't need to return anything)
        (pool.query as jest.Mock).mockResolvedValueOnce({});

        const result = await HodRepo.deleteAllHodById(2);
        expect(result).toBe(true);
        expect(pool.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`, [2]);
        expect(pool.query).toHaveBeenCalledWith(hodQueries.deleteHodProc, [2]);
    });

    it("should return false when HOD ID does not exist", async () => {
        // Mock the check query to return rowCount as 0 (ID not found)
        (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });

        const result = await HodRepo.deleteAllHodById(99);
        expect(result).toBe(false);
        expect(pool.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`, [99]);
    });

    //120 test case
    it("should handle database errors gracefully", async () => {
        (pool.query as jest.Mock).mockRejectedValueOnce(new Error("Database error"));

        await expect(HodRepo.deleteAllHodById(3)).rejects.toThrow("(Repository) Error in deleting Hod by Id: Database error");
        expect(pool.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`, [3]);
    });
});

})
