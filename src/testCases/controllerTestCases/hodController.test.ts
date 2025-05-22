
import * as hodServices from '../../service/hodService';
import { app } from '../../app';
import request from 'supertest';
import pool from '../../config/dbConnect';

jest.mock('../../service/hodService');

describe('Hod Controller Tests', ()=>{
    describe('POST(addHodController)', ()=>{
        beforeAll(()=>{
            jest.spyOn(console, 'log').mockImplementation(()=>{});
            jest.spyOn(console, 'error').mockImplementation(()=>{});
        });

        afterEach(()=>{
            jest.clearAllMocks();
        });

        afterAll(async()=>{
            await pool.end();
        })

        //55 test case is from Hod controller

        it('it should return status of 400 when name is missing', async()=>{
           const res = await request(app).post('/api/hod/addhod').send({parentId:1});

        //    (hodServices.addHod as jest.Mock).mockResolvedValue(null);

           expect(res.status).toBe(400);
           expect(res.body).toEqual({
                success: false,
                message: `name and parent_id are required`,
           })
        });

        it('it should return status of 400 if parentId is missing', async()=>{
            const res = await request(app).post('/api/hod/addhod').send({name:'test hod'});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: `name and parent_id are required`,
            })
        });

        //57
        it('it should return status of 400 if name and parentId are missing', async()=>{
            const res = await request(app).post('/api/hod/addhod').send({});

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: `name and parent_id are required`,
            })
        });

        it('it should return the status of 200, when added hod',async()=>{
            const mockHodDetails = {id:2, name: 'test hod', role: 'Hod', parentId: 1};

            (hodServices.addHod as jest.Mock).mockResolvedValue(mockHodDetails);

            const response = await request(app).post('/api/hod/addhod').send(mockHodDetails);

            expect(response.status).toBe(201);
            expect(response.body).toEqual({
                message: `HOD added successfully`,
                data: mockHodDetails
            })
        })


        it("it should return 500 if there is service error", async () => {
          const mockError = new Error("Service failure");

          (hodServices.addHod as jest.Mock).mockRejectedValue(mockError);

          const response = await request(app)
            .post("/api/hod/addhod")
            .send({ name: "test hod", parentId: 1 });

          expect(response.status).toBe(500);
          expect(response.body).toEqual({
            message: "Error while adding Hod",
            error: mockError.message,
          });
        });
    });


    describe('getHodController', ()=>{
        beforeEach(()=>{
            jest.clearAllMocks();
        })

        it('it should return status 200 for get hod details',async()=>{
            const mockHod = 
            [
                {id:20, name: 'test hod 1',  parentId: 1},
                {id:3, name: 'test hod 2',  parentId: 1}
            ];

            (hodServices.getHod as jest.Mock).mockResolvedValue(mockHod);

            const response = await request(app).get('/api/hod/gethod')

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockHod);
        })

         it("it should return 500 if there is service error", async () => {
           const mockError = new Error("Service failure");

           (hodServices.getHod as jest.Mock).mockRejectedValue(mockError);

           const response = await request(app).get("/api/hod/gethod");

           expect(response.status).toBe(500);
           expect(response.body).toEqual({
             message: "Error in getting hod data (controller)",
             error: mockError.message,
           });
         });
    })


    describe('getHodByIdController ',()=>{
        beforeAll(() => {
          // Prevent console logs/errors from cluttering the test output.
          jest.spyOn(console, 'log').mockImplementation(() => {});
          jest.spyOn(console, 'error').mockImplementation(() => {});
        });
      
        beforeEach(() => {
          // Clear mocks after each test.
          jest.clearAllMocks();
        });

        it('it should return status 400 when invalid id format',async()=>{
            const response  = await request(app).get('/api/hod/gethodbyid/xyz');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({
                message: `Invalid id format (controller)`
            })
        });

        it('should return status 404 if hod with given id is not found',async()=>{
            (hodServices.getHodById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/hod/gethodbyid/1');
            
            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: `Hod with 1 not found (controller)`
            })
        });


        it('it should return 200 status code and hod details by Id', async()=>{
            const mockHodDetails = {id:7, name:'Test hod 1'};

            (hodServices.getHodById as jest.Mock).mockResolvedValue(mockHodDetails);

            const response  = await request(app).get('/api/hod/gethodbyid/7');
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                success: true,
                message:`Hod of id: 7`,
                data: mockHodDetails
            })
        })


          it("returns 500 if the service throws", async () => {
            (hodServices.getHodById as jest.Mock).mockRejectedValue(
              new Error("DB offline")
            );

            const res = await request(app).get("/api/hod/gethodbyid/5");
            // expect(hodServices.getHodById).toHaveBeenCalledWith(5);
            expect(res.status).toBe(500);
            expect(res.body).toEqual({
              success: false,
              message: `Error in getting Hod (controller)`,
              error: "DB offline",
            });
          });
    })


    describe('updateHodController',()=>{

        beforeAll(()=>{
            jest.spyOn(console, 'log').mockImplementation(()=>{});
            jest.spyOn(console, 'error').mockImplementation(()=>{});
        });

        beforeEach(()=>{
            jest.clearAllMocks();
        });

        it('it should return 400 if name and id is not given or invalibodyd', async()=>{
            const response = await request(app).put('/api/hod/updatehodbyid/abc');

            expect(response.status).toBe(400);
            expect(response.body).toEqual({error: `Id and name are required`});
        })

        it('it should return 404 if principal not found or update failed', async()=>{

            (hodServices.ServiceUpdateHod as jest.Mock).mockResolvedValue(null);

            const response = await request(app).put('/api/hod/updatehodbyid/1').send({name:'update hod 1'});

            expect(response.status).toBe(404);
            expect(response.body).toEqual({
                error: `Hod not found or update failed`
            })
        });

        it("it should return 200 if the details have been updated", async () => {
          const mockUpdatedHodDetails = { id: 1, name: "updated hod name" };

          (hodServices.ServiceUpdateHod as jest.Mock).mockResolvedValue(
            mockUpdatedHodDetails
          );

          const response = await request(app).put('/api/hod/updatehodbyid/1').send(mockUpdatedHodDetails);

          expect(response.status).toBe(200);
          expect(response.body).toEqual({
            message: "hod upadated successfully",
            data: mockUpdatedHodDetails,
          });
        });

        it('it should return 500 id there is any service error', async()=>{
                const mockError = new Error('Update failed');
        
                (hodServices.ServiceUpdateHod as jest.Mock).mockRejectedValue(mockError);
        
                const response = await request(app).put('/api/hod/updatehodbyid/1').send({name: 'Updated hod name'});
                expect(response.status).toBe(500);
                expect(response.body).toEqual({
                    message:'error while updating Hod',
                    error: 'Update failed'
                });
            })
    })

    describe('getAllHodByIdController',()=>{
        beforeAll(()=>{
        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })
        
        it('it return 400 if id is not provided',async()=>{

            const resposne = await request(app).get('/api/hod/getallbyid/');

            expect(resposne.status).toBe(400);
            expect(resposne.body).toEqual({
               error: 'Id is required' 
            });
        })

        it('it should return 404 if id is not provided', async()=>{

            (hodServices.getAllHodById as jest.Mock).mockResolvedValue(null);

            const response = await request(app).get('/api/hod/getallbyid/1');

            expect(response.status).toBe(404);
            expect(response.body).toEqual({error:'Hod not found or fetching failed'});
        })

        it('it should return 200 if data fetched successfully', async()=>{
        
                const mockgetAllById = {id:1, name: 'hod name'};
        
                (hodServices.getAllHodById as jest.Mock).mockResolvedValue(mockgetAllById);
        
                const response = await request(app).get('/api/hod/getallbyid/1')
        
                expect(response.status).toBe(200);
                expect(response.body.message).toBe(`data fetched successfully`);
                expect(response.body.data).toEqual(mockgetAllById);
            });


        it('it should ewturn 500 if there is any server error', async()=>{
        
                const mockError = new Error('Get failed');
        
                (hodServices.getAllHodById as jest.Mock).mockRejectedValue(mockError);
        
                const response = await request(app).get('/api/hod/getallbyid/1');
        
                expect(response.status).toBe(500);
                expect(response.body).toEqual({
                    message:'error while fetching Hod',
                    error:'Get failed'
                });
            });
    })

    describe('deleteHodController ', ()=>{
        beforeAll(()=>{
        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});
    });

    afterEach(()=>{
        jest.clearAllMocks();
    })

        it('it should return 400 if Id is not provided',async()=>{
        
                const response = await request(app).delete('/api/hod/deletehod/');
                expect(response.status).toBe(400);
                expect(response.body).toEqual({
                    error: 'Id is required' 
                })
            })

        it('it should return 404 if id is not found or invalid id', async()=>{
                (hodServices.deleteHod as jest.Mock).mockResolvedValue(null);
        
                const response = await request(app).delete('/api/hod/deletehod/1');
        
                expect(response.status).toBe(404);
                expect(response.body).toEqual({
                    error: 'Id not found or delete failed'
                });
            })

        it('it should return status of 200 if deletion successfull', async()=>{
        
                const mockDeleteHod = {id: 1, name: 'Test hod name'};
        
                (hodServices.deleteHod as jest.Mock).mockResolvedValue(mockDeleteHod);
        
                const response = await request(app).delete('/api/hod/deletehod/1');
        
                expect(response.status).toBe(200);
                expect(response.body).toEqual({
                    message: 'Hod and related child data deleted succuessfully'
                })
            })
        
        it('it should return 500 status code or error message', async()=>{
                const errorMessage = 'delete failed';
        
                (hodServices.deleteHod as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
                const response = await request(app).delete('/api/hod/deletehod/1');
        
                expect(response.status).toBe(500);
                expect(response.body).toEqual({
                    message: `Error while deleting Hod`,
                    error: errorMessage
                })
            })

        
    })


})