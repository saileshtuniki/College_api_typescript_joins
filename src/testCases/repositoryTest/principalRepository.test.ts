import { Principal, UpdateResponse } from './../../exportInterfaces/principalInterface';
// mock the database , so real db dont effect

jest.mock('../../config/dbConnect', () => ({
  query: jest.fn(), // Mock the query method
}));

import pool from '../../config/dbConnect'; // Import the mocked pool

import * as principalRepository from '../../repository/principalRepository';
import principalQueries from '../../queries/principalSqlQueries';
import { beforeEach } from 'node:test';


describe('Repository layer Test Cases',()=>{

describe('insertPrincipal repo', ()=>{
  it('it should insert a principal into database', async()=>{
    const newPrincipal : Principal = { id:1, name:'test principal', role:'Principal', parentId: null};

    (pool.query as jest.Mock).mockResolvedValue({
      rows:[newPrincipal]
    })

    jest.spyOn(principalRepository, 'fetchPrincipal').mockResolvedValueOnce(newPrincipal as unknown as void);

    const result = await principalRepository.insertPrincipal(newPrincipal.name);

    expect(result).toEqual(newPrincipal);
    expect(pool.query).toHaveBeenCalledWith(principalQueries.addPrincipalProc, [newPrincipal.name]);
    expect(principalRepository.fetchPrincipal).toHaveBeenCalled(); 
  })

  it('it should throw error if any query fails',async()=>{
    const errorMessage = 'query failed';
    (pool.query as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
    // jest.spyOn(principalRepository, 'insertPrincipal').mockRejectedValueOnce(new Error(errorMessage));
    
    await expect(principalRepository.insertPrincipal('test principal')).rejects.toThrow(
      `Error inserting principal: ${errorMessage}`
    )
  })

})

describe('fetchPrincipal repo', ()=>{
  beforeEach(()=>{
    jest.clearAllMocks();
  })

  it('it should fetch the principal data',async()=>{
    const mockGetPrincialData = {id:1, name:'test principal', role: 'Principal', parentId:null};

    (pool.query as jest.Mock).mockResolvedValue({
      rows:[mockGetPrincialData]
    })

    // jest.spyOn(principalRepository, 'fetchPrincipal').mockResolvedValueOnce(mockGetPrincialData as unknown as void)

    const result = await principalRepository.fetchPrincipal();

    expect(result).toEqual(mockGetPrincialData);
    expect(pool.query).toHaveBeenCalledWith(principalQueries.principalView);

  })

  it('it should throw an error if query fails', async()=>{
    const errorMessage = 'query fails'; 
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    await expect(principalRepository.fetchPrincipal).rejects.toThrow(
      `Error in fetching principal: ${errorMessage}`
    )
  })
})

describe('fetchprincipalById repo', ()=>{

  const principalId = 1;
  const mockPrincipalById = {id:1, name:'test principal', role: 'Principal', parentId:null};
  
  beforeEach(()=>{
    jest.clearAllMocks();
  })

  it('it should return the principal data based on Id', async()=>{

      (pool.query as jest.Mock).mockResolvedValue({
        rows:[mockPrincipalById]
      })
      const result = await principalRepository.fetchprincipalById(principalId);

      expect(pool.query).toHaveBeenCalledWith(principalQueries.fetchPrincipalByIdQuery, [principalId]);
      expect(result).toEqual(mockPrincipalById);

  })

  it('it should return null if no data found based on given Id', async()=>{

    (pool.query as jest.Mock).mockResolvedValue({
      rows:[],
    })

    const result = await principalRepository.fetchprincipalById(principalId);

    expect(result).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(principalQueries.fetchPrincipalByIdQuery, [principalId]);
  })


  it('throw error when query fails', async()=>{
    const errorMessage = 'query fails';

    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage))

    await expect(principalRepository.fetchprincipalById).rejects.toThrow(
      `Error in fetching principal by Id: ${errorMessage}`
    )
  })
})


describe('updatePrincipal repo', ()=>{

  const id = 1
  const name = 'Updated Principal'

  const mockPrincipal :Principal = {
    id,
    name,
    role: 'Principal',
    parentId: null
  }

    beforeEach(()=>{
    jest.clearAllMocks()
  });

  it('it should update the principal details',async()=>{

    (pool.query as jest.Mock)
    .mockResolvedValue({rowCount: 1})  //update query result
    .mockResolvedValue({rows: [mockPrincipal]})  //fetch updated principal

    const result: UpdateResponse = await (principalRepository.updatePrincipal(id, name))

    expect(pool.query).toHaveBeenCalledWith(principalQueries.updatePrincipalProc, [id, name]);
    expect(pool.query).toHaveBeenCalledWith(principalQueries.fetchPrincipalByIdQuery, [id]);

    expect(result).toEqual({
      message: `Principal with id: ${id} updated successfully`,
      data: mockPrincipal
    });

  });


  it('it should show principal not found, when no update was made', async()=>{
    (pool.query as jest.Mock).mockResolvedValueOnce({rowCount:0}); //no update was made

    const result: UpdateResponse = await (principalRepository.updatePrincipal (id, name));

    expect(pool.query).toHaveBeenCalledWith(principalQueries.updatePrincipalProc, [id,name]);

    expect(result).toEqual({
      message:`Principal with ${id} not found. No update was made`,    
    })
  })

  it('it should throw error if query fails', async()=>{
    const errorMessage = 'query fail';
    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(principalRepository.updatePrincipal (id,name)).rejects.toThrow(
      `Error in updating prinicpal by Id: ${errorMessage}`
    )
  })
})

describe('fetchAllById repo',()=>{

  const id = 19;
  const mockFetchAllById: Principal = {id, name:'test principal' , role:'Principal', parentId: null};
 

  beforeEach(()=>{
    jest.clearAllMocks();
  });

  //49 test case
  it('it should fetch All data along with principal and its sub nodes',async()=>{
      (pool.query as jest.Mock).mockResolvedValue({rows: [mockFetchAllById]});

      const result = await (principalRepository.fetchAllById(id));

      expect(pool.query).toHaveBeenCalledWith(principalQueries.fetchAllById, [id]);

      expect(result).toEqual(mockFetchAllById);
  })

  it('it should return null if there is no rows are returned', async()=>{
      (pool.query as jest.Mock).mockResolvedValue({rows:[]});

      const result = await(principalRepository.fetchAllById(id));

      expect(pool.query).toHaveBeenCalledWith(principalQueries.fetchAllById, [id]);
      expect(result).toBeNull();
  })

  //50 
  it('it should throw error if there is any query issue', async()=>{
    const errorMessage = 'query fail';

    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(principalRepository.fetchAllById).rejects.toThrow(
      `Error in fetching prinicpal and child data by Id: ${errorMessage}`
    )
  })

})

describe('deleteAllById', ()=>{
  
  const id = 69;
  // const mockedData: Principal = {id, name:'test principal' , role:'Principal', parentId: null};

  beforeEach(()=>{
    jest.clearAllMocks();
  })

  it('it checks does Id exists or not', async()=>{

      (pool.query as jest.Mock).mockResolvedValue({rowCount: 0});

      const logSpy = jest.spyOn(console, 'log').mockImplementation(()=>{})

      const result = await principalRepository.deleteAllById(id);

      expect(pool.query).toHaveBeenCalledWith(`select id from college_hierarchy_tree where id=$1`,[id]);
      expect(logSpy).toHaveBeenCalledWith(`ID ${id} not found in database`);
      expect(result).toBe(false);

      logSpy.mockRestore();
  })

  it('it should delete the id if ID exists', async()=>{

    (pool.query as jest.Mock)
    .mockResolvedValue({rowCount:1, rows: [{id}]})
    .mockResolvedValue({rowCount:1})

    const result = await principalRepository.deleteAllById(id);

    expect(pool.query).toHaveBeenNthCalledWith(1, `select id from college_hierarchy_tree where id=$1`,[id]);

    expect(pool.query).toHaveBeenNthCalledWith(2, principalQueries.deletePrincipalProc, [id]);

    expect(result).toBe(true);
  })

  it('it should throw error if there is query fail', async()=>{
    const errorMessage = 'query fail';

    (pool.query as jest.Mock).mockRejectedValue(new Error(errorMessage));

    await expect(principalRepository.deleteAllById).rejects.toThrow(
      `(Repository) Error in deleting prinicpal by Id: ${errorMessage}`
    )
  })
})

});