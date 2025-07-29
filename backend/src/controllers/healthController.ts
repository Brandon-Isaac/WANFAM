import {Request, Response} from 'express';
import asyncHandler from "../middleware/asyncHandler";
import { HealthRecord } from '../models/HealthRecord';
import { UserRole } from '../models/UserRoles';

const getHealthRecords = asyncHandler(async (req: Request, res: Response) => {
    const healthRecords = await HealthRecord.find({});
    return res.json(healthRecords);
});

const getHealthRecordById = asyncHandler(async (req: Request, res: Response) => {
    const recordId = req.params.id;
    const healthRecord = await HealthRecord.findById(recordId);
    if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
    }
    return res.json(healthRecord);
});

const createHealthRecord = asyncHandler(async (req: Request, res: Response) => {
    const { livestockId, healthStatus, notes } = req.body;
    if (!livestockId || !healthStatus) {
        return res.status(400).json({ message: 'Livestock ID and health status are required' });
    }
    const healthRecord = new HealthRecord({ livestockId, healthStatus, notes });
    await healthRecord.save();
    return res.status(201).json(healthRecord);
});

const updateHealthRecord = asyncHandler(async (req: Request, res: Response) => {
    const recordId = req.params.id;
    const { healthStatus, notes } = req.body;
    const healthRecord = await HealthRecord.findByIdAndUpdate(recordId, { healthStatus, notes }, { new: true, runValidators: true });
    if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
    }
    return res.json(healthRecord);
});

const deleteHealthRecord = asyncHandler(async (req: Request, res: Response) => {
    const recordId = req.params.id;
    const healthRecord = await HealthRecord.findByIdAndDelete(recordId);
    if (!healthRecord) {
        return res.status(404).json({ message: 'Health record not found' });
    }
    return res.json({ message: 'Health record deleted successfully' });
});

const healthController = {
    getHealthRecords,
    getHealthRecordById,
    createHealthRecord,
    updateHealthRecord,
    deleteHealthRecord
};

export default healthController;