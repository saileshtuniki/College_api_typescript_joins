import express from 'express';
import { addProfessorController, getProfessorsController, getProfessorByIdController, updateProfessorController, getAllProfByIdController, deleteProfessorController  } from '../controller/professorController';

const router = express.Router();

router.post('/addprofessor', addProfessorController);
router.get('/getprofessor', getProfessorsController);
router.get('/getprofessorbyid/:id', getProfessorByIdController);
router.put('/updateprofessor/:id', updateProfessorController);
router.get('/getallbyid/:id', getAllProfByIdController);
router.delete('/deleteprofessor/:id', deleteProfessorController);

export default router;
