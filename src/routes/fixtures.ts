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
  searchFixture,
  getFixture,
} from '../controllers/fixture';

const router = Router();

router.get('/search', searchFixture);
router.get('/', auth, viewFixtures);
router.get('/pending', auth, viewPendingFixtures);
router.get('/completed', auth, viewCompletedFixtures);
router.get('/:id', auth, getFixture);
router.post('/', [auth, admin], addFixture);
router.put('/:id', [auth, admin], editFixture);
router.delete('/:id', [auth, admin], removeFixture);

export default router;
