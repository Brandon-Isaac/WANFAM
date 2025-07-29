import userController from "../controllers/userController";
import { UserRole } from '../models/UserRoles'; 
import { Router } from 'express';
import { authenticate } from "../middleware/auth";
import { roleHandler } from "../middleware/roleHandler";

const router = Router();

router.get('/', authenticate, roleHandler([UserRole.ADMIN]), userController.getUsers);
router.get('/:id', authenticate, roleHandler([UserRole.ADMIN]), userController.getUserById);
router.put('/:id', authenticate, roleHandler([UserRole.ADMIN]), userController.updateUser);
router.delete('/:id', authenticate, roleHandler([UserRole.ADMIN]), userController.deleteUser);

export default router;