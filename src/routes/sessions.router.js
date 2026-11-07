import { Router } from 'express';
import {
  current,
  getSessionsStatus,
  login,
  logout,
  register,
} from '../controllers/sessions.controller.js';
import { auth } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', getSessionsStatus);
router.post('/register', register);
router.post('/login', login);
router.get('/current', auth, current);
router.post('/logout', logout);

export default router;