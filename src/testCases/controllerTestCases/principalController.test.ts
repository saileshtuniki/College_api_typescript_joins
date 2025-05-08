import { Response } from 'express';
import { getAllByIdService, getPrincipal, getPrincipalById, serviceupdatePrincipal } from './../../service/principalService';
import { fetchPrincipal, updatePrincipal } from './../../repository/principalRepository';

import request from 'supertest';
import {app} from '../../app';
// import * as principalServices from '../../service/principalService'
import {addPrincipal} from '../../service/principalService'
// import {pool} from '../../app';
import  pool  from '../../config/dbConnect';

jest.mock('../../service/principalService');


describe('Principal Controller Tests',()=>{
    describe('POST (addPrincipalController)',()=>{
        beforeAll(() => {
            jest.spyOn(console, 'log').mockImplementation(() => {});
            jest.spyOn(console, 'error').mockImplementation(() => {});
        });

        afterEach(()=>{
            jest.clearAllMocks();
        });

        afterAll(async ()=>{
            await pool.end();
        })

        it('it should return status of 400 when the name is missing', async()=>{

            // const newPrincipal = {name: 'Test Principal'};
            // const mcokCreatedPrinicpal = {id:1, newPrincipal};
            const response = await request(app).post('/api/principal/addprincipal').send({});

            (addPrincipal as jest.Mock).mockResolvedValue(null);

            expect(response.status).toBe(400);
            expect(response.body).toEqual({message:'Name is not Provided'});
        });

        it('it should create a principal and return status of 200', async()=>{

            const newPrincipal = {name: 'Test Principal'};
            const mockCreatedPrinicpal = {id:1, ...newPrincipal};

            (addPrincipal as jest.Mock).mockResolvedValue(mockCreatedPrinicpal);

            const response = await request(app).post('/api/principal/addprincipal').send(newPrincipal);

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success:  true,
                message: 'Principal added successfully',
                data: mockCreatedPrinicpal,
            });
        })

        it('it should return 500 if there is service error', async()=>{
            const mockError = new Error('Service failure');

            (addPrincipal as jest.Mock).mockRejectedValue(mockError);

            const response = await  request(app).post('/api/principal/addprincipal').send({name:'Test principal'})
            // jest.spyOn('addPricipal').mockRejectedValue(mockError);

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error in adding principal',
                error: mockError.message
            });

        })
    })


    describe('GET (getPrincipalController)',()=>{
        afterEach(()=>{
            jest.clearAllMocks();
        })

        it('it should get principal details', async()=>{
            const mockPrincipal = {id: 1, name: "Test Prinicpal"};

            (getPrincipal as jest.Mock).mockResolvedValue(mockPrincipal);

            const response = await request(app).get('/api/principal/getprincipal')

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                message: 'Principal fetched successfully',
                data: mockPrincipal
            })
        })

        it('it should return 500 error', async()=>{
            const mockError = new Error('Service failure');

            (getPrincipal as jest.Mock).mockRejectedValue(mockError);

            const response = await request(app).get('/api/principal/getprincipal');

            expect(response.status).toBe(500);
            expect(response.body).toEqual({
                success: false,
                message: 'Error in getting principal',
                // error: mockError.message
            });
        })
    })



    describe('GET /api/principal/getbyid/:id', () => {
        beforeAll(() => {
          // Prevent console logs/errors from cluttering the test output.
          jest.spyOn(console, 'log').mockImplementation(() => {});
          jest.spyOn(console, 'error').mockImplementation(() => {});
        });
      
        afterEach(() => {
          // Clear mocks after each test.
          jest.clearAllMocks();
        });
      
      
        it('should return status 400 for invalid id format', async () => {
          // Sending a non-numeric value triggers isNaN check in the controller.
          const response = await request(app).get('/api/principal/getbyid/invalid');
      
          expect(response.status).toBe(400);
          expect(response.body).toEqual({ message: 'Invalid Id format' });
        });
      
        it('should return status 404 if principal with given id is not found', async () => {
          // Set up the service mock to return null for a non-existing principal.
          (getPrincipalById as jest.Mock).mockResolvedValue(null);
      
          const response = await request(app).get('/api/principal/getbyid/1');
          expect(response.status).toBe(404);
          expect(response.body).toEqual({ error: 'Principal with id not found' });
        });
      
        it('should return status 200 and principal details if found', async () => {
          const mockPrincipal = { id: 1, name: 'Test Principal' };
          // Set up the service mock to return a valid principal.
          (getPrincipalById as jest.Mock).mockResolvedValue(mockPrincipal);
      
          const response = await request(app).get('/api/principal/getbyid/1');
          expect(response.status).toBe(200);
          expect(response.body).toEqual({
            success: true,
            messsage: 'Principal of id: % 1', // Note: The key "messsage" must match the controller code.
            data: mockPrincipal,
          });
        });
      
        it('should return status 500 in case of a service error', async () => {
          const mockError = new Error('Service error');
          // Cause the service to throw an error.
          (getPrincipalById as jest.Mock).mockRejectedValue(mockError);
      
          const response = await request(app).get('/api/principal/getbyid/1');
          expect(response.status).toBe(500);
          expect(response.body).toEqual({
            success: false,
            message: 'Error in getting principal',
          });
        });

})


describe('PUT update the principal details', ()=>{

    beforeAll(()=>{
        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })

    it('it should return 400 if id and name is not given or invalid',async ()=>{
        
        const response =  await request(app).put('/api/principal/updateprincipal/invalid').send({});

        expect(response.status).toBe(400);
        expect(response.body).toEqual({error: 'Id and name are required'});
    });

    it('it should return 404 if prinicpal not found or update failed', async()=>{

        (serviceupdatePrincipal as jest.Mock).mockResolvedValue(null);

        const response = await request(app).put('/api/principal/updateprincipal/1').send({name:'Test name'});

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('principal not found or update failed');
    });

    it('it should return 200 if the details have been updated', async()=>{

        const mockUpdatedDetails = {id:1, name: 'new name'};

        (serviceupdatePrincipal as jest.Mock).mockResolvedValue(mockUpdatedDetails);

        const response = await request(app).put('/api/principal/updateprincipal/1').send(mockUpdatedDetails);

        expect(response.status).toBe(200);
        expect(response.body.message).toEqual('Principal updated successfully');
        // expect(response.body.data).toEqual(response);
    })

    it('it should return 500 id there is any service error', async()=>{
        const mockError = new Error('Update failed');

        (serviceupdatePrincipal as jest.Mock).mockRejectedValue(mockError);

        const response = await request(app).put('/api/principal/updateprincipal/1').send({name: 'Updated principal'});
        expect(response.status).toBe(500);
        expect(response.body).toEqual({
            message:'Error while updating principal',
            error: 'Update failed'
        });
    })
})

describe('GET getAllByIdController to get all details in a tree format', ()=>{

    it('it should return 400 if id not provided',async()=>{

        // (getAllByIdService as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get('/api/principal/getallbyid/invalid');

        expect(response.status).toBe(400);
        // expect(response.body).toEqual({error:'Id is required'});
        expect(response.body).toEqual({error:'Id is required and must be a positive integer'});
    })

    it('it should return 404 if id not provided',async()=>{

        (getAllByIdService as jest.Mock).mockResolvedValue(null);

        const response = await request(app).get('/api/principal/getallbyid/1');

        expect(response.status).toBe(404);
        expect(response.body).toEqual({error:'Id not found or Fetching failed'});
    })

    it('it should return 200 if data fetched successfully', async()=>{

        const mockgetAllById = {id:1, name: 'Test name'};

        (getAllByIdService as jest.Mock).mockResolvedValue(mockgetAllById);

        const response = await request(app).get('/api/principal/getallbyid/1')

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(`Principal and child data fetched succuessfully`);
        expect(response.body.data).toEqual(mockgetAllById);
    })

    it('it should ewturn 500 if there is any server error', async()=>{

        const mockError = new Error('Get failed');

        (getAllByIdService as jest.Mock).mockRejectedValue(mockError);

        const response = await request(app).get('/api/principal/getallbyid/1');

        expect(response.status).toBe(500);
        // expect(response.body.message).toBe('Error while updating principal');
        // expect(response.body.error).toBe('Get failed');
        expect(response.body).toEqual({
            message:'Error while updating principal',
            error:'Get failed'
        });
    })


});



})

