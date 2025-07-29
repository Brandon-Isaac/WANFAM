import { FeedingSchedule } from "../models/FeedingSchedule";
import { Request, Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";

const getFeedingSchedules = asyncHandler(async (req: Request, res: Response) => {
    const schedules = await FeedingSchedule.find({});
    return res.json(schedules);
});

const getFeedingScheduleById = asyncHandler(async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    const schedule = await FeedingSchedule.findById(scheduleId);
    if (!schedule) {
        return res.status(404).json({ message: 'Feeding schedule not found' });
    }
    return res.json(schedule);
});

const createFeedingSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { livestockId, feedingTime, foodType } = req.body;
    if (!livestockId || !feedingTime || !foodType) {
        return res.status(400).json({ message: 'Livestock ID, feeding time, and food type are required' });
    }
    const schedule = new FeedingSchedule({ livestockId, feedingTime, foodType });
    await schedule.save();
    return res.status(201).json(schedule);
});

const generateFeedingSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { livestockId, healthStatus, favoriteMeals, nutritionNeeds } = req.body;

    if (!livestockId || !healthStatus || !favoriteMeals || !nutritionNeeds) {
        return res.status(400).json({ message: 'Livestock ID, health status, favorite meals, and nutrition needs are required' });
    }

    // Prepare prompt for Gemini
    const prompt = `
      Given the following livestock information:
      - Health Status: ${healthStatus}
      - Favorite Meals: ${JSON.stringify(favoriteMeals)}
      - Nutrition Needs: ${JSON.stringify(nutritionNeeds)}
      Suggest an optimal feeding time and food type for the livestock. 
      Respond in JSON format: { "feedingTime": "...", "foodType": "..." }
    `;

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        // Parse Gemini's response
        const { feedingTime, foodType } = JSON.parse(response);

        const schedule = new FeedingSchedule({
            livestockId,
            feedingTime,
            foodType,
            healthStatus,
            nutritionNeeds
        });

        await schedule.save();
        return res.status(201).json(schedule);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to generate feeding schedule',
            error: error instanceof Error ? error.message : 'Unknown error'
         });
    }
});

const updateFeedingSchedule = asyncHandler(async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    const { feedingTime, foodType } = req.body;
    const schedule = await FeedingSchedule.findByIdAndUpdate(scheduleId, { feedingTime, foodType }, { new: true, runValidators: true });
    if (!schedule) {
        return res.status(404).json({ message: 'Feeding schedule not found' });
    }
    return res.json(schedule);
});

const deleteFeedingSchedule = asyncHandler(async (req: Request, res: Response) => {
    const scheduleId = req.params.id;
    const schedule = await FeedingSchedule.findByIdAndDelete(scheduleId);
    if (!schedule) {
        return res.status(404).json({ message: 'Feeding schedule not found' });
    }
    return res.json({ message: 'Feeding schedule deleted successfully' });
});

const feedingController = {
    getFeedingSchedules,
    getFeedingScheduleById,
    createFeedingSchedule,
    generateFeedingSchedule,
    updateFeedingSchedule,
    deleteFeedingSchedule
};

export default feedingController;