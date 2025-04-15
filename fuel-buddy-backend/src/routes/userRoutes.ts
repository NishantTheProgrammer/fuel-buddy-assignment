import { Router } from 'express';
import {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
} from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.get('/email/:email', getUserByEmail);

export default router; 