import { Router } from 'express';
import userRoutes from './users';
import teamRoutes from './teams';
import fixtureRoutes from './fixtures';

const router = Router();

router.use('/users', userRoutes);
router.use('/teams', teamRoutes);
router.use('/fixtures', fixtureRoutes);

export default router;
