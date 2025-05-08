
// import { insertPrincipal, fetchPrincipal, fetchprincipalById, updatePrincipal as updatePrincipalRepository, fetchAllById, deleteAllById } from '../../repository/principalRepository';

import {Principal, UpdateResponse } from '../../exportInterfaces/principalInterface';
import * as principalRepository from '../../repository/principalRepository'; 

import { addPrincipal, getPrincipal ,getPrincipalById, serviceupdatePrincipal, getAllByIdService, deletePrincipal } from '../../service/principalService';

// import { Principal } from '../../exportInterfaces/principalInterface';

jest.mock('../../repository/principalRepository');

describe('principal service tests', ()=> {
  describe('addPrincipal service', ()=>{
    beforeEach(()=>{
      jest.clearAllMocks()
    })

    it('it should throw error if name is not provided', async()=>{
      await expect(addPrincipal('')).rejects.toThrow('Name is required');
    })
 
    it('it should call insertPrincipal from repository and returns the inserted principal',async()=>{
        const newPrincipal ='Test Principal';
        const mockAddPrincipal = {id:1, name: newPrincipal, role: 'principal', parentId: null};

        (principalRepository.insertPrincipal as jest.Mock).mockResolvedValue(mockAddPrincipal);

        const result = await addPrincipal(newPrincipal);

        expect(principalRepository.insertPrincipal).toHaveBeenCalledWith(newPrincipal);
        expect(result).toEqual(mockAddPrincipal);
    })
    
    it('it should throw an error when insert principal fails', async()=>{
      const validName = 'Test Principal';
      const errorMessgae = 'Database failure';

      jest.spyOn(principalRepository, 'insertPrincipal').mockRejectedValue(new Error(errorMessgae));

      await expect(addPrincipal(validName)).rejects.toThrow(
        `Error in adding Principal: ${errorMessgae}`
      );
    })
  })

  describe('getPrincipal service', ()=>{

    beforeEach(()=>{
      jest.clearAllMocks();
    })

    it('it should call the fetchPrincipal from repository and returns the principal data',async()=>{
        const principalData = {id:1, name: 'Test Principal', role: 'Principal', parentId: null}
        const mockPrincipalData = {...principalData};

        (principalRepository.fetchPrincipal as jest.Mock).mockResolvedValue(mockPrincipalData);

        const result = await getPrincipal();

        expect(principalRepository.fetchPrincipal).toHaveBeenCalled();  //arg not required
        expect(result).toEqual(mockPrincipalData);
    })

    it('it should throw an error when fetchPrincipal fails', async()=>{
        // const validName = {id:1, name: 'Test Principal', role: 'Principal', parentId: null};
        const errorMessage = 'Database failure';

        jest.spyOn(principalRepository, 'fetchPrincipal').mockRejectedValue(new Error(errorMessage));

        await expect(getPrincipal()).rejects.toThrow(
          `Error in getting principal: ${errorMessage}`
        )
    })
  })

  describe('getPrinicpalById service', ()=>{

    beforeEach(()=>{
      jest.clearAllMocks()
    })

    it('it throw error if ID is not provided or valid', async()=>{
      await expect(getPrincipalById(undefined as unknown as number)).rejects.toThrow('Id is required');
    })

    it('it should call getPrincipalById from repository and returns the principal by id', async()=>{
      
      const mockPrincipalData = {id:1, name:'Test Principal', role:'Principal', parentId:null};

      (principalRepository.fetchprincipalById as jest.Mock).mockResolvedValue(mockPrincipalData);

      const result = await getPrincipalById(1);

      expect(principalRepository.fetchprincipalById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPrincipalData);

    })

    it('it should throw an error when getById fails', async()=>{

        const principalId = 1
        const errorMessage = 'Database failure';

        jest.spyOn(principalRepository, 'fetchprincipalById').mockRejectedValue(new Error(errorMessage));

        await expect(getPrincipalById(principalId)).rejects.toThrow(
          `Error in fetching principal by Id: ${errorMessage}`
        )
    })
  })

  describe('serviceupdatePrincipal service', ()=>{
    beforeEach(()=>{
      jest.clearAllMocks()
    })

    it('it should throw an error if id and name are not provided', async()=>{
      await expect(serviceupdatePrincipal(undefined as unknown as number , '')).rejects.toThrow('ID and Name are required');
    })
    it('it should throw error if name is not provided', async()=>{
      await expect(serviceupdatePrincipal(1, '')).rejects.toThrow('ID and Name are required');
    })

    it('it should update principal when valid id and name given', async()=>{
      const principalId = 1;
      const newName = 'Updated principal'
      const mockResponse : UpdateResponse ={success: true, message: 'Principal Updated'};

      (principalRepository.updatePrincipal as jest.Mock).mockResolvedValue(mockResponse);

      const result = await serviceupdatePrincipal(principalId, newName);

      expect(result).toEqual(mockResponse);
      expect(principalRepository.updatePrincipal).toHaveBeenCalledWith(principalId, newName);
    })

    it('it should throw error if principal is not found or update failed', async()=>{
        (principalRepository.updatePrincipal as jest.Mock).mockResolvedValue(null);

        await expect(serviceupdatePrincipal(99, 'updated Name')).rejects.toThrow(
          'Principal not found or update has failed'
        )
    })

    it('it should throw error if there is any repository operation fails', async()=>{

      const errorMessage = 'Database failure';
      jest.spyOn(principalRepository, 'updatePrincipal').mockRejectedValue(new Error(errorMessage));

      await expect(serviceupdatePrincipal(1, 'Updated Name')).rejects.toThrow(
        `Error updating principal: ${errorMessage}`
      )
    })
  })

  describe('getAllByIdService service', ()=>{
    beforeEach(()=>{
      jest.clearAllMocks();
    })

    it('it should throw error if ID is not provided', async()=>{
      await expect(getAllByIdService(undefined as unknown as number)).rejects.toThrow(
        'ID is required'
      )
    })

    // it('it should return all data of principal and sub nodes',async()=>{
    //     const principalId = 1;

    //     const mockResponse = {}
    // })

    it('should return principal data when fetchAllById succeeds', async () => {
      const principalId = 1;
      const mockPrincipal: Principal = { id: principalId, name: 'Test Principal', role: 'Admin', parentId: null };
  
      jest.spyOn(principalRepository, 'fetchAllById').mockResolvedValue(mockPrincipal);
  
      const result = await getAllByIdService(principalId);
  
      expect(result).toEqual(mockPrincipal);
      expect(principalRepository.fetchAllById).toHaveBeenCalledWith(principalId);
    });

    it('it should throw error if ID not provided or not valid', async()=>{
      jest.spyOn(principalRepository, 'fetchAllById').mockResolvedValue(null);

      await expect(getAllByIdService(99)).rejects.toThrow('Data not found (Service)');
    })

    it('it should throw error if there is any repository operation has failed', async()=>{

      const errorMessage = 'Database failed'
      jest.spyOn(principalRepository, 'fetchAllById').mockRejectedValue(new Error(errorMessage));

      await expect(getAllByIdService(1)).rejects.toThrow(
        `Error in fetching data from principal: ${errorMessage}`
      )
    })
  })

  describe('deletePrincipal service', ()=>{
    beforeEach(()=>{
      jest.clearAllMocks();
    });

    it('it should throw error when id is not provided', async()=>{
      await expect(deletePrincipal(undefined as unknown as number)).rejects.toThrow(
        'ID is required'
      )
      })

    it('it should return true after principal is deleted of specific ID', async()=>{
      const principalId = 1;
      jest.spyOn(principalRepository, 'deleteAllById').mockResolvedValue(true);

      const result = await deletePrincipal(principalId);
      expect(result).toBe(true);
    })

    it('it will throw error when no matching Id or Id not found',async()=>{

      jest.spyOn(principalRepository, 'deleteAllById').mockResolvedValue(false);

      await expect(deletePrincipal(99)).rejects.toThrow(
        'No matching ID found to delete (Service)'
      )
    })

    it('it should throw error if repository operation fails', async()=>{
        const errorMessage = 'repository error'

        jest.spyOn(principalRepository, 'deleteAllById').mockRejectedValue(new Error(errorMessage));

        await expect(deletePrincipal(3)).rejects.toThrow(
          `Error in deleteing data from principal and child (service): ${errorMessage}`
        )
    })
  })


});
 

