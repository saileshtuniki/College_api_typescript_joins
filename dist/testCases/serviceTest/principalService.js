"use strict";
// jest.mock('../../config/dbConnect', () => ({
//     __esModule: true,
//     default: {
//       query: jest.fn(),
//     },
//   }));
//   import pool from '../../config/dbConnect';
//   import { insertPrincipal, fetchPrincipal } from '../../repository/principalRepository';
//   jest.mock('../../queries/principalSqlQueries', () => ({
//     addPrincipalProc: 'CALL addPrincipalProc($1)',
//     principalView: 'SELECT * FROM principalView',
//   }));
//   describe('Principal Repository - insertPrincipal & fetchPrincipal', () => {
//     it('should execute stored procedure to insert principal', async () => {
//       (pool.query as jest.Mock)
//       .mockResolvedValueOnce({ rows: [] })
//       .mockResolvedValueOnce({ rows: [{id: 1, name:'John Doe'}] });  //mock for fetch principal
//       const result = await insertPrincipal('John Doe');
//       expect(pool.query).toHaveBeenCalledWith('CALL addPrincipalProc($1)', ['John Doe']);
//       expect(result).toEqual({id:1, name:'John Deo'})
//     });
//     it('should fetch principal correctly', async () => {
//       const mockPrincipal = { id: 1, name: 'John Doe' };
//       (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [mockPrincipal] });
//       const result = await fetchPrincipal();
//       expect(pool.query).toHaveBeenCalledWith('SELECT * FROM principalView');
//       expect(result).toEqual(mockPrincipal);
//     });
//     it('should handle errors in fetchPrincipal', async () => {
//       (pool.query as jest.Mock).mockRejectedValue(new Error('Query failed'));
//       await expect(fetchPrincipal()).rejects.toThrow('Error in fetching principal: Query failed');
//     });
//   });
// jest.mock('../../repository/principalRepository', () => ({
//     insertPrincipal: jest.fn(),
//   }));
//   import { addPrincipal  } from '../../service/principalService';
//   import {  insertPrincipal } from '../../repository/principalRepository';
//   describe('Principal Service - addPrincipal', () => {
//     beforeEach(() => {
//       jest.resetAllMocks(); // Reset mocks between tests
//     });
//     it('should throw an error if name is missing', async () => {
//       await expect(addPrincipal('')).rejects.toThrow('Name is required');
//     });
//     it('should call insertPrincipal and return the expected result', async () => {
//       const mockPrincipal = { id: 1, name: 'John Doe' };
//       // Mocking repository response
//       (insertPrincipal as jest.Mock).mockResolvedValue(mockPrincipal);
//       const result = await addPrincipal('John Doe');
//       expect(insertPrincipal).toHaveBeenCalledWith('John Doe');
//       expect(result).toEqual(mockPrincipal);
//     });
//     it('should propagate errors from insertPrincipal', async () => {
//       (insertPrincipal as jest.Mock).mockRejectedValue(new Error('Database error'));
//       await expect(addPrincipal('John Doe')).rejects.toThrow('Error in adding Principal: Database error');
//     });
//   });
