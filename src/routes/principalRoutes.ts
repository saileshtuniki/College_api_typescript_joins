import express from 'express';
import { addPrincipalController ,getPrincipalController, getPrincipalByIdController, updatePrinicpalController, getAllByIdController, deletePrincipalController} from '../controller/principalController';

const router = express.Router();

router.post('/addprincipal', addPrincipalController);
router.get('/getprincipal', getPrincipalController);
router.get('/getbyid/:id', getPrincipalByIdController);
router.put('/updateprincipal/:id', updatePrinicpalController);
router.get('/getallbyid/:id',getAllByIdController);

router.delete('/deleteprincipal/:id',deletePrincipalController);
export default router;

