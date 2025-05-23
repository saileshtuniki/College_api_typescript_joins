import pool from '../../config/dbConnect';
import studentQueries from '../../queries/studentSqlQueries';
import {
  insertStudent,
  fetchStudent,
  fetchStudentById,
  updateStudent,
  deleteAllStudentById,
} from '../../repository/studentRepository';
import { Student, StudentResponse } from '../../exportInterfaces/studentInterface';

// Mock the pool module so that pool.query is replaced by Jest's mock function.
jest.mock('../../config/dbConnect', () => ({
  query: jest.fn(),
}));

describe('Student Repository Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })

  describe('insertStudent', () => {
    const name = 'John Doe';
    const parentId = 5;
    const fakeStudent: Student = { id: 1, name: 'John Doe', parentId };

    it('should insert a student and return the inserted student', async () => {
      // First call: simulate stored proc for adding the student. The result is unused.
      // Second call: simulate the SELECT query returning the inserted student.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({}) // For studentQueries.addStudentProc call
        .mockResolvedValueOnce({ rows: [fakeStudent] }); // For select query

      const result = await insertStudent(name, parentId);
      expect(result).toEqual(fakeStudent);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1, studentQueries.addStudentProc, [name, parentId]);
      expect(pool.query).toHaveBeenNthCalledWith(
        2,
        `select * from Student where name=$1 and professorId=$2 order by id DESC LIMIT 1`,
        [name, parentId]
      );
    });

    it('should throw an error if the insert query returns no rows', async () => {
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({}) // For first query
        .mockResolvedValueOnce({ rows: [] }); // No rows found in the select query

      await expect(insertStudent(name, parentId)).rejects.toThrow(
        'Failed to insert student: Professor insertion failed'
      );
    });

    it('should throw an error if pool.query rejects (simulate DB error)', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(insertStudent(name, parentId)).rejects.toThrow('Failed to insert student: DB Error');
    });
  });

  describe('fetchStudent', () => {
    it('should return list of students', async () => {
      const students: Student[] = [
        { id: 1, name: 'Alice', parentId: 2 },
        { id: 2, name: 'Bob', parentId: 3 },
      ];
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: students });
      const result = await fetchStudent();
      expect(result).toEqual(students);
      expect(pool.query).toHaveBeenCalledWith(studentQueries.studentView);
    });

    it('should throw an error when pool.query fails', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(fetchStudent()).rejects.toThrow('Failed to fetch students');
    });
  });

  describe('fetchStudentById', () => {
    it('should return a student by id', async () => {
      const student: Student = { id: 1, name: 'Charlie', parentId: 4 };
      (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [student] });
      const result = await fetchStudentById(1);
      expect(result).toEqual(student);
      expect(pool.query).toHaveBeenCalledWith(studentQueries.fetchStudentByIdFunc, [1]);
    });

    it('should throw an error if pool.query fails', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(fetchStudentById(1)).rejects.toThrow('Failed to fetch student by ID');
    });
  });

  describe('updateStudent', () => {
    const id = 1;
    const name = 'Updated Name';
    const updatedStudent: Student = { id: 1, name: 'Updated Name', parentId: 5 };

    it('should update the student and return a success response with updated student', async () => {
      // First call: update query; Second call: fetch updated student details.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({}) // For updateStudentProc query
        .mockResolvedValueOnce({ rows: [updatedStudent] }); // For fetchStudentByIdFunc query

      const result = await updateStudent(id, name);
      const expectedResponse: StudentResponse = {
        success: true,
        message: `Updated student with id:${id} successfully`,
        data: updatedStudent,
      };
      expect(result).toEqual(expectedResponse);
      expect(pool.query).toHaveBeenCalledTimes(2);
      expect(pool.query).toHaveBeenNthCalledWith(1, studentQueries.updateStudentProc, [id, name]);
      expect(pool.query).toHaveBeenNthCalledWith(2, studentQueries.fetchStudentByIdFunc, [id]);
    });

    it('should throw an error if any of the queries fails', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB update error'));
      await expect(updateStudent(id, name)).rejects.toThrow('Failed to update student');
    });
  });

  describe('deleteAllStudentById', () => {
    it('should return false if no matching id is found in college_hierarchy_tree', async () => {
      // Simulate the check query returning 0 (no rows)
      (pool.query as jest.Mock).mockResolvedValueOnce({ rowCount: 0 });
      const result = await deleteAllStudentById(1);
      expect(result).toBe(false);
      expect(pool.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`, [1]);
    });

    it('should delete the student and return true if id exists', async () => {
      // First, simulate the lookup query: rowCount > 0.
      // Then simulate successful deletion.
      (pool.query as jest.Mock)
        .mockResolvedValueOnce({ rowCount: 1 }) // check query: id exists
        .mockResolvedValueOnce({}); // delete query succeeds

      const result = await deleteAllStudentById(1);
      expect(result).toBe(true);
      expect(pool.query).toHaveBeenNthCalledWith(
        1,
        `select id from college_hierarchy_tree where id=$1`,
        [1]
      );
      expect(pool.query).toHaveBeenNthCalledWith(2, studentQueries.deleteStudentProc, [1]);
    });

    it('should throw an error if pool.query fails during deletion', async () => {
      (pool.query as jest.Mock).mockRejectedValue(new Error('DB Error'));
      await expect(deleteAllStudentById(1)).rejects.toThrow(
        '(Repository) Error in deleting Student by Id: DB Error'
      );
    });
  });
});
