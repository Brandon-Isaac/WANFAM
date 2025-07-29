import healthController from "../controllers/healthController";
import { roleHandler } from "../middleware/roleHandler";
import { UserRole } from "../models/UserRoles";
import express from 'express';

const router = express.Router();

router.get('/healthRecords', roleHandler([UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), healthController.getHealthRecords);
router.get('/healthRecords/:id', roleHandler([UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), healthController.getHealthRecordById);
router.post('/healthRecords', roleHandler([UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), healthController.createHealthRecord);
router.put('/healthRecords/:id', roleHandler([UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), healthController.updateHealthRecord);
router.delete('/healthRecords/:id', roleHandler([UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), healthController.deleteHealthRecord);

export default router;