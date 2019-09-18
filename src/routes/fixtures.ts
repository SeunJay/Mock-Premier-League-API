import { Router } from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import {
  viewFixtures,
  viewPendingFixtures,
  viewCompletedFixtures,
  addFixture,
  editFixture,
  removeFixture,
} from '../controllers/fixture';

const router = Router();

router.get('/', auth, viewFixtures);
router.get('/pending', auth, viewPendingFixtures);
router.get('/completed', auth, viewCompletedFixtures);

export default router;
