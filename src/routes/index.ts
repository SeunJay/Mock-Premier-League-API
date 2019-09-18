import { Router } from 'express';
import userRoutes from './users';
import teamRoutes from './teams';
//import teamRoutes from './teams';

const router = Router();

router.use('/users', userRoutes);
router.use('/teams', teamRoutes);

export default router;
