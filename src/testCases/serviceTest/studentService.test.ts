import * as studentRepository from '../../repository/studentRepository';
import {
  addStudentService,
  getStudentService,
  getStudentByIdService,
  updateStudentService,
  deleteStudent,
} from '../../service/studentService';
import { Student, StudentResponse } from '../../exportInterfaces/studentInterface';

// Mocking repository functions
jest.mock('../../repository/studentRepository');

describe('Student Service Tests', () => {
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })
    
  describe('addStudentService', () => {
    it('should add a student successfully', async () => {
      const mockStudent: Student = { id: 1, name: 'John Doe', parentId: 5 };
      (studentRepository.insertStudent as jest.Mock).mockResolvedValue(mockStudent);

      const result = await addStudentService('John Doe', 5);
      expect(result).toEqual(mockStudent);
    });

    it('should throw an error when name or parentId is missing', async () => {
      // Test missing name; note that 0 is treated as falsy so it works for missing parentId as well.
      await expect(addStudentService('', 5)).rejects.toThrow('Failed to add student');
      await expect(addStudentService('John Doe', 0)).rejects.toThrow('Failed to add student');
    });

    it('should throw an error when insertStudent (repository) fails', async () => {
      (studentRepository.insertStudent as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(addStudentService('John Doe', 5)).rejects.toThrow('Failed to add student');
    });
  });

  describe('getStudentService', () => {
    it('should return a list of students', async () => {
      const students: Student[] = [{ id: 1, name: 'Jane Doe', parentId: 2 }];
      (studentRepository.fetchStudent as jest.Mock).mockResolvedValue(students);

      const result = await getStudentService();
      expect(result).toEqual(students);
    });

    it('should throw an error when fetchStudent (repository) fails', async () => {
      (studentRepository.fetchStudent as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(getStudentService()).rejects.toThrow('Failed to fetch students');
    });
  });

  describe('getStudentByIdService', () => {
    it('should return a student when a valid id is provided', async () => {
      const student: Student = { id: 1, name: 'Jane Doe', parentId: 2 };
      (studentRepository.fetchStudentById as jest.Mock).mockResolvedValue(student);

      const result = await getStudentByIdService(1);
      expect(result).toEqual(student);
    });

    it('should throw an error when id is missing or falsy', async () => {
      // When id is falsy (e.g., 0), it will throw inside the service.
      await expect(getStudentByIdService(0)).rejects.toThrow('Failed to fetch student by ID');
    });

    it('should throw an error when fetchStudentById (repository) fails', async () => {
      (studentRepository.fetchStudentById as jest.Mock).mockRejectedValue(new Error('DB error'));

      await expect(getStudentByIdService(1)).rejects.toThrow('Failed to fetch student by ID');
    });
  });

  describe('updateStudentService', () => {
    it('should update a student successfully', async () => {
      const updatedStudent = { id: 1, name: 'Updated Name' };
      (studentRepository.updateStudent as jest.Mock).mockResolvedValue(updatedStudent);

      const result = await updateStudentService(1, 'Updated Name');
      expect(result).toEqual(updatedStudent);
    });

    it('should throw an error when id or name is missing', async () => {
      await expect(updateStudentService(0, 'Updated Name')).rejects.toThrow('Failed to update student');
      await expect(updateStudentService(1, '')).rejects.toThrow('Failed to update student');
    });

    it('should throw an error when updateStudent (repository) fails', async () => {
      (studentRepository.updateStudent as jest.Mock).mockRejectedValue(new Error('DB update error'));

      await expect(updateStudentService(1, 'Updated Name')).rejects.toThrow('Failed to update student');
    });
  });

  describe('deleteStudent', () => {
    it('should delete a student successfully', async () => {
      (studentRepository.deleteAllStudentById as jest.Mock).mockResolvedValue(true);

      const result = await deleteStudent(1);
      expect(result).toBe(true);
    });

    it('should throw an error when id is missing (falsy id)', async () => {
      await expect(deleteStudent(0)).rejects.toThrow(
        'Error in deleting data of Student Student ID is required'
      );
    });

    it('should throw an error when repository returns no matching id', async () => {
      (studentRepository.deleteAllStudentById as jest.Mock).mockResolvedValue(false);

      await expect(deleteStudent(1)).rejects.toThrow(
        'Error in deleting data of Student No matching ID found to delete (service)'
      );
    });

    it('should throw an error when deleteAllStudentById (repository) fails', async () => {
      (studentRepository.deleteAllStudentById as jest.Mock).mockRejectedValue(new Error('DB Error'));

      await expect(deleteStudent(1)).rejects.toThrow('Error in deleting data of Student DB Error');
    });
  });
});
