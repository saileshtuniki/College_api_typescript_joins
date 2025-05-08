import express from 'express';

import principalRoutes from './principalRoutes';
import hodRoutes from './hodRoutes';
import professorRoutes from './professorRoutes';
import studentRoutes from './studentRoutes';

const router = express.Router();
router.use('/principal',principalRoutes);
router.use('/hod',hodRoutes);
router.use('/professor',professorRoutes);

router.use('/student',studentRoutes);

export default router;