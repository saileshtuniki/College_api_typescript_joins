import express from 'express';
import { addStudentController, getStudentsController, getStudentByIdController, updateStudentController, deleteStudentController } from '../controller/studentController';

const router = express.Router();

router.post('/addstudent', addStudentController);
router.get('/getstudent', getStudentsController);
router.get('/getstudentbyid/:id', getStudentByIdController);
router.put('/updatestudent/:id', updateStudentController);

router.delete('/deletestudent/:id', deleteStudentController);


// router.delete('/deletestudent/:id', deleteStudentController);

export default router;


