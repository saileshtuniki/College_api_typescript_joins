
import * as HodRepo from '../../repository/hodRepository';

import {addHod, getHod, getHodById, ServiceUpdateHod, getAllHodById, deleteHod} from "../../service/hodService";

jest.mock('../../repository/hodRepository');


describe('hod service test',()=>{
    afterEach(()=>{
            jest.clearAllMocks();
        })
    describe('addHod service test', ()=>{
        beforeEach(()=>{
        jest.clearAllMocks();

        
        jest.spyOn(console, 'log').mockImplementation(()=>{});
        jest.spyOn(console, 'error').mockImplementation(()=>{});

        
    })

    // it('it should throw error if ID and name are not given',async()=>{

    //     await expect(addHod('', 2))
    //     .rejects.toThrow('Name and parentId are required');
    //     expect(HodRepo.insertHod).not.toHaveBeenCalled();
    // })

    // it('it should throw error if ID and name are not given',async()=>{

    //     await expect(addHod('', 1))
    //     .rejects.toThrow('Name and parentId are required');
    //     expect(HodRepo.insertHod).not.toHaveBeenCalled();
    // })

    // OR other way in test.each block 

    test.each<[string, any]>([
    ['',    5      ],  // empty name
    ['Alice', undefined],  // missing parentId
  ])(
    'throws when name=%p, parentId=%p',
    async (badName, badParentId) => {
      await expect(addHod(badName, badParentId))
        .rejects
        .toThrow('Name and parentId are required');
      expect(HodRepo.insertHod).not.toHaveBeenCalled();
    }
  );

  it('it should call the insertHod repo and return the inserted Hod', async()=>{
    // const mockHodId = 2;
    const mockHodDetails = { id:2, name:"test hod 2", role: 'Hod', parentId: 1};

    (HodRepo.insertHod as jest.Mock).mockResolvedValue(mockHodDetails);

    const result = await HodRepo.insertHod('Test name 1', 2);
    expect(result).toEqual(mockHodDetails);
  })


    it('should throw error if repository operation fails', async () => {
        // const HodDetails = {name: 'test hod 1', id: 2}
        const errorMessage = 'Database failure';

    //jest.spyOn(HodRepo, 'insertHod').mockRejectedValue(new Error(errorMessage));
    (HodRepo.insertHod as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(addHod('test hod 1', 2)).rejects.toThrow(`error in adding hod: ${errorMessage}`);
    });

    })

    describe('getHod service', ()=>{
        beforeEach(() => {
          jest.clearAllMocks();
        });

        it('it should return the inserted hod details', async()=>{
            const mockHod = {id: 2, name: "Test hod 1", role:"Hod", parentId: 1};

            (HodRepo.fetchHod as jest.Mock).mockResolvedValue(mockHod);

            const result = await getHod();

            expect(HodRepo.fetchHod).toHaveBeenCalled();
            expect(result).toEqual(mockHod);
        });

        it('it should throw an error when fetchHod fails', async()=>{
                const errorMessage = 'Database failure';
        
                (HodRepo.fetchHod as jest.Mock).mockRejectedValue(new Error(errorMessage));
        
                await expect(getHod()).rejects.toThrow(
                  `Fetching data of Hod has failed (service) ${errorMessage}`
                )
        })
    })

    describe('getHodById service', ()=>{

    beforeEach(()=>{
      jest.clearAllMocks()
    })

    it('it throw error if ID is not provided or valid', async()=>{
      await expect(getHodById(undefined as unknown as number)).rejects.toThrow('Id is required');
    })

    it('it should call getPrincipalById from repository and returns the principal by id', async()=>{
      
      const mockHodData = {id: 2, name: "Test hod 1", role:"Hod", parentId: 1};

      (HodRepo.fetchHodById as jest.Mock).mockResolvedValue(mockHodData);

      const result = await getHodById(2);

      expect(HodRepo.fetchHodById).toHaveBeenCalledWith(2);
      expect(result).toEqual(mockHodData);

    })

    it('it should throw an error when getById fails', async()=>{

        const hodId = 1
        const errorMessage = 'Database failure';

        jest.spyOn(HodRepo, 'fetchHodById').mockRejectedValue(new Error(errorMessage));

        await expect(getHodById(hodId)).rejects.toThrow(
          `Error in fetching Hod by id: ${errorMessage}`
        )
    })
  })


   describe('ServiceUpdateHod service', ()=>{
  
      beforeEach(()=>{
        jest.clearAllMocks() 
      })
  
    //   it('it throw error if ID is not provided or valid', async()=>{
    //     await expect(ServiceUpdateHod(2,'')).rejects.toThrow('Id and name are required (service)');
    //   })


      // below test case validates 2 cases one for id and other for name
      test.each<[string, any]>([
        ["", 5], // empty name
        ["Alice", undefined], // missing parentId
      ])("throws when name=%p, parentId=%p", async (badName, badParentId) => {
        await expect(ServiceUpdateHod(badParentId, badName)).rejects.toThrow(
          'Id and name are required (service)'
        );
        expect(HodRepo.updateHodRepository).not.toHaveBeenCalled();
      });

      it('it should throw error if result is null ot hod not found', async()=>{

        (HodRepo.updateHodRepository as jest.Mock).mockResolvedValue(null);

        await expect(ServiceUpdateHod(2, 'test hod 2')).rejects.toThrow(`Hod not found or update has failed`);
      })

  
      it('it should call updateHodRepository from repository and updates by id', async()=>{
        
        const mockHodData = {id: 2, name: "Test hod 1", role:"Hod", parentId: 1};
  
        (HodRepo.updateHodRepository as jest.Mock).mockResolvedValue(mockHodData);
  
        const result = await ServiceUpdateHod(2, 'updated hod');
  
        expect(HodRepo.updateHodRepository).toHaveBeenCalledWith(2,'updated hod');
        expect(result).toEqual(mockHodData);
  
      })
  
      it('it should throw an error when ServiceUpdateHod fails', async()=>{
  
          const errorMessage = 'Database failure';
  
          jest.spyOn(HodRepo, 'updateHodRepository' ).mockRejectedValue(new Error(errorMessage));
  
          await expect(ServiceUpdateHod(2,'updated hod')).rejects.toThrow(
            `Error updating Hod:${errorMessage}`
          )
      })
    })


    describe('getAllHodById  result of hod and its sub node connected to it',()=>{
        it('it should throw error if ID is not provided or valid', async()=>{
            // (HodRepo.fetchAllHodById as jest.Mock)
           await expect(getAllHodById(undefined as unknown as number)).rejects.toThrow('Id is required (service)');
        })

        it('it resutns the result based on Id given', async()=>{
            // const mockHodById = {id: 2, name:'test hod', role:'hod', parentId: 1};

            const mockData = {
              message: "data fetched successfully",
              data: {
                fetchallbyhodid: {
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
                },
              },
            };
              (HodRepo.fetchAllHodById as jest.Mock).mockResolvedValue(mockData);

                const result = await getAllHodById(3);
                expect(HodRepo.fetchAllHodById).toHaveBeenCalled();
                expect(result).toBe(mockData);
            
            });

            it('it should throw error if result is null ot hod not found', async()=>{

            (HodRepo.fetchAllHodById as jest.Mock).mockResolvedValue(null);

            await expect(getAllHodById(2)).rejects.toThrow(`Hod not found or fetching has failed`);

            });


            it('it should throw error if there is any operation fails', async()=>{
                const errorMessage = 'database error';

                (HodRepo.fetchAllHodById as jest.Mock).mockRejectedValue(new Error(errorMessage));

                await expect(getAllHodById(3)).rejects.toThrow(`Error in fetching Hod:${errorMessage}`)
            });

        })


        describe('deleteHod service test',()=>{
            it('it throws error if Id is not provided', async()=>{

            await expect(deleteHod(undefined as unknown as number)).rejects.toThrow(
                'ID is required'
            )
            });

            it('it deletes the data of given Id', async()=>{
                const mockHodId = 2;
                jest.spyOn(HodRepo, 'deleteAllHodById').mockResolvedValue(true);

                const result = await deleteHod(mockHodId);
                expect(result).toBe(true);
            });

            it('it will throw error when no matching Id or Id not found', async()=>{

                jest.spyOn(HodRepo, 'deleteAllHodById').mockResolvedValue(false);

                await expect(deleteHod(99)).rejects.toThrow(
                    `No matching ID found to delete (Service)`
                )
            })

            it('it should throw error if repository operation fails', async()=>{
                const errorMessage = 'database error';
                (HodRepo.deleteAllHodById as jest.Mock).mockRejectedValue(new Error(errorMessage));

                await expect(deleteHod(99)).rejects.toThrow(
                    `Error in deleteing data from Hod and related child data (service): ${errorMessage}`
                )
            });
        })


    });
    
