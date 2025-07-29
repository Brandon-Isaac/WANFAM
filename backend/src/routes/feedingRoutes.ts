import feedingController from "../controllers/feedingController";
import { roleHandler } from "../middleware/roleHandler";
import { UserRole } from "../models/UserRoles";
import express from 'express';

const router = express.Router();

router.get('/feedingSchedules', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), feedingController.getFeedingSchedules);
router.get('/feedingSchedules/:id', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), feedingController.getFeedingScheduleById);
router.post('/feedingSchedules', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), feedingController.createFeedingSchedule);
router.post('/feedingSchedules/generate', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), feedingController.generateFeedingSchedule);
router.put('/feedingSchedules/:id', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), feedingController.updateFeedingSchedule);
router.delete('/feedingSchedules/:id', roleHandler([UserRole.FARMER, UserRole.VETERINARY_OFFICER, UserRole.ADMIN]), feedingController.deleteFeedingSchedule);

export default router;