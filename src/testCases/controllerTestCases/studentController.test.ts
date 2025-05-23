import request from 'supertest';
import {app} from '../../app'; // Adjust the import based on your Express server setup
import * as studentService from '../../service/studentService';

jest.mock('../../service/studentService');

describe('Student Controller Tests', () => {
    
    beforeEach(()=>{

        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    })

    describe('POST /student', () => {
        it('should return 400 if name or parentId is missing', async () => {
            const response = await request(app).post('/api/student/addstudent').send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Name and Parent ID are required');
        });

        it('should return 201 and add a student', async () => {
            const mockStudent = { id: 1, name: 'John Doe', parentId: 5 };
            (studentService.addStudentService as jest.Mock).mockResolvedValue(mockStudent);

            const response = await request(app).post('/api/student/addstudent').send({ name: 'John Doe', parentId: 5 });
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('Student added successfully');
            expect(response.body.data).toEqual(mockStudent);
        });

        it('should return 500 if service fails', async () => {
            (studentService.addStudentService as jest.Mock).mockRejectedValue(new Error('Service Error'));

            const response = await request(app).post('/api/student/addstudent').send({ name: 'John Doe', parentId: 5 });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Cannot add Student');
        });
    });

    describe('GET /student', () => {
        it('should return students list', async () => {
            const mockStudents = [{ id: 1, name: 'John Doe', parentId: 5 }];
            (studentService.getStudentService as jest.Mock).mockResolvedValue(mockStudents);

            const response = await request(app).get('/api/student/getstudent');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockStudents);
        });

        it('should return 500 if service fails', async () => {
            (studentService.getStudentService as jest.Mock).mockRejectedValue(new Error('Service Error'));

            const response = await request(app).get('/api/student/getstudent');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });
    });

    describe('GET /student/:id', () => {
        it('should return 400 for invalid ID', async () => {
            const response = await request(app).get('/api/student/getstudentbyid/abc');
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Invalid ID format');
        });

        it('should return student by ID', async () => {
            const mockStudent = { id: 1, name: 'John Doe', parentId: 5 };
            (studentService.getStudentByIdService as jest.Mock).mockResolvedValue(mockStudent);

            const response = await request(app).get('/api/student/getstudentbyid/1');
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockStudent);
        });

        it('should return 500 if service fails', async () => {
            (studentService.getStudentByIdService as jest.Mock).mockRejectedValue(new Error('Service Error'));

            const response = await request(app).get('/api/student/getstudentbyid/1');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });
    });

    describe('PUT /students/:id', () => {
        it('should return 400 if ID or name is invalid', async () => {
            const response = await request(app).put('/api/student/updatestudent/abc').send({});
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Valid ID and Name are required');
        });

        it('should update student and return 200', async () => {
            const mockUpdatedStudent = { id: 1, name: 'Updated Name' };
            (studentService.updateStudentService as jest.Mock).mockResolvedValue(mockUpdatedStudent);

            const response = await request(app).put('/api/student/updatestudent/1').send({ name: 'Updated Name' });
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Student updated successfully');
            expect(response.body.data).toEqual(mockUpdatedStudent);
        });

        it('should return 500 if service fails', async () => {
            (studentService.updateStudentService as jest.Mock).mockRejectedValue(new Error('Service Error'));

            const response = await request(app).put('/api/student/updatestudent/1').send({ name: 'Updated Name' });
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Server Error');
        });
    });

    describe('DELETE /students/:id', () => {
        it('should return 400 if ID is missing', async () => {
            const response = await request(app).delete('/api/student/deletestudent/');
            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                error: 'Id is required'
            })
        });


        it('should return 404 if student not found', async () => {
            (studentService.deleteStudent as jest.Mock).mockResolvedValue(null);

            const response = await request(app).delete('/api/student/deletestudent/1');
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                message: 'id not found or delete failed'
            })
        });

        it('should delete student and return 200', async () => {

            const mockDeleteStudent = {id:1, name:' test student'};

            (studentService.deleteStudent as jest.Mock).mockResolvedValue(mockDeleteStudent);

            const response = await request(app).delete('/api/student/deletestudent/1');
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Student id: 1 deleted successfully');
        });

        it('should return 500 if service fails', async () => {
            (studentService.deleteStudent as jest.Mock).mockRejectedValue(new Error('Service Error'));

            const response = await request(app).delete('/api/student/deletestudent/1');
            expect(response.status).toBe(500);
            expect(response.body.message).toBe('Cannot delete Student');
        });
    });
});
