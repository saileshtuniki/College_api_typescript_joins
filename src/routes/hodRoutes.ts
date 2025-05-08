import express from 'express';

const router = express.Router();

import { addHodController, getHodController, getHodByIdController, updateHodController, getAllHodByIdController, deleteHodController } from '../controller/hodController';

router.post('/addhod', addHodController);
router.get('/gethod', getHodController);
router.get('/gethodbyid/:id',getHodByIdController);
router.put('/updatehodbyid/:id', updateHodController);
router.get('/getallbyid/:id',getAllHodByIdController);

router.delete('/deletehod/:id',deleteHodController)
export default router;

