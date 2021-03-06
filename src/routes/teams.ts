import { Router } from 'express';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import {
  viewTeams,
  addTeam,
  editTeam,
  removeTeam,
  searchTeam,
} from '../controllers/team';

const router = Router();

router
  .get('/', auth, viewTeams)
  .post('/', auth, admin, addTeam)
  .put('/:id', [auth, admin], editTeam)
  .delete('/:id', [auth, admin], removeTeam)
  .get('/search', searchTeam);

export default router;
