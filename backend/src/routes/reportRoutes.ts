import reportController from "../controllers/reportController";
import { roleHandler } from "../middleware/roleHandler";
import { UserRole } from "../models/UserRoles";
import express from 'express';

const router = express.Router();

router.get('/reports', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), reportController.getReportRequests);
router.get('/reports/:id', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), reportController.getReportRequestById);
router.post('/reports', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), reportController.createReportRequest);
router.put('/reports/:id', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), reportController.updateReportRequest);
router.delete('/reports/:id', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), reportController.deleteReportRequest);
router.post('/reports/generate', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), reportController.generateReportWithAI);

export default router;