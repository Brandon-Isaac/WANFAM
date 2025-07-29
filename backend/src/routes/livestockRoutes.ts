import livestockController from "../controllers/livestockController";
import { roleHandler } from "../middleware/roleHandler";
import { UserRole } from "../models/UserRoles";
import express from 'express';

const router = express.Router();

router.get('/', roleHandler([UserRole.FARMER, UserRole.ADMIN]), livestockController.getLivestock);
router.get('/:id', livestockController.getLivestockById);
router.post('/', roleHandler([UserRole.FARMER, UserRole.ADMIN]), livestockController.createLivestock);
router.put('/:id', roleHandler([UserRole.FARMER, UserRole.ADMIN]), livestockController.updateLivestock);
router.delete('/:id', roleHandler([UserRole.FARMER, UserRole.ADMIN]), livestockController.deleteLivestock);

export default router;