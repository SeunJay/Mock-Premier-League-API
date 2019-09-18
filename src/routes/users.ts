import { Router } from 'express';
import { login } from '../controllers/login';
import { signup } from '../controllers/signup';

const router = Router();

router.post('/login', login).post('/signup', signup);

export default router;
