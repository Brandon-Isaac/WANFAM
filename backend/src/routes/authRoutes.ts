import authController from "../controllers/authController";
import { Router } from 'express';
import { authenticate } from "../middleware/auth";

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.put('/update', authenticate, authController.updateDetails);

export default router;