import {Request , Response} from 'express';
import asyncHandler from "../middleware/asyncHandler";
import { Livestock } from '../models/Livestock'; // Adjust the import path as necessary

const getLivestock = asyncHandler(async (req: Request, res: Response) => {
    const livestock = await Livestock.find();
    res.json(livestock);
});

const getLivestockById = asyncHandler(async (req: Request, res: Response) => {
    const livestockId = req.params.id;
    const livestock = await Livestock.findById(livestockId);
    if (!livestock) {
        return res.status(404).json({ message: 'Livestock not found' });
    }
    res.json(livestock);
});

const createLivestock = asyncHandler(async (req: Request, res: Response) => {
    const { name, type, age, healthStatus } = req.body;
    if (!name || !type || !age || !healthStatus) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    const livestock = new Livestock({ name, type, age, healthStatus });
    await livestock.save();
    res.status(201).json(livestock);
});

const updateLivestock = asyncHandler(async (req: Request, res: Response) => {
    const livestockId = req.params.id;
    const { name, type, age, healthStatus } = req.body;
    const livestock = await Livestock.findByIdAndUpdate(livestockId, { name, type, age, healthStatus }, { new: true, runValidators: true });
    if (!livestock) {
        return res.status(404).json({ message: 'Livestock not found' });
    }
    res.json(livestock);
});

const deleteLivestock = asyncHandler(async (req: Request, res: Response) => {
    const livestockId = req.params.id;
    const livestock = await Livestock.findByIdAndDelete(livestockId);
    if (!livestock) {
        return res.status(404).json({ message: 'Livestock not found' });
    }
    res.json({ message: 'Livestock deleted successfully' });
});

const livestockController = {
    getLivestock,
    getLivestockById,
    createLivestock,
    updateLivestock,
    deleteLivestock
};

export default livestockController;