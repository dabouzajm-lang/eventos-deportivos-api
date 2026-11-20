import { Router } from 'express';
import {
  getSessionsStatus,
  register,
  login,
  current,
  logout,
} from '../controllers/sessions.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getSessionsStatus);

router.post('/register', authenticate('register'), register);

router.post('/login', authenticate('login'), login);

router.get('/current', authenticate('current'), current);

router.post('/logout', logout);

export default router;