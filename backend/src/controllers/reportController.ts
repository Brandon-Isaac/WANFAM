import { Request,Response } from "express";
import asyncHandler from "../middleware/asyncHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ReportRequest } from "../models/Report";

const getReportRequests = asyncHandler(async (req: Request, res: Response) => {
    const reports = await ReportRequest.find().populate('farmer officer');
    res.json(reports);
});

const getReportRequestById = asyncHandler(async (req: Request, res: Response) => {
    const reportId = req.params.id;
    const report = await ReportRequest.findById(reportId).populate('farmer officer');
    if (!report) {
        return res.status(404).json({ message: 'Report request not found' });
    }
    res.json(report);
});
const generateReportWithAI = asyncHandler(async (req: Request, res: Response) => {
    const { farmerId, officerId, details } = req.body;

    // Fetch farmer and officer details if needed
    // const farmer = await Farmer.findById(farmerId);
    // const officer = await Officer.findById(officerId);

    // Prepare prompt for Gemini AI
    const prompt = `
        Generate a detailed agricultural loan application report for the following:
        Farmer ID: ${farmerId}
        Officer ID: ${officerId}
        Details: ${details}
        The report should be formal and suitable for a loan application.
    `;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        const result = await model.generateContent(prompt);
        const reportText = result.response.text();

        res.json({ report: reportText });
    } catch (error) {
        res.status(500).json({ message: "Failed to generate report",
            error: error instanceof Error ? error.message : 'Unknown error'
         });
    }
});

const createReportRequest = asyncHandler(async (req: Request, res: Response) => {
    const { farmer, officer, details } = req.body;
    if (!farmer || !details) {
        return res.status(400).json({ message: 'Farmer and details are required' });
    }
    const reportRequest = new ReportRequest({ farmer, officer, details });
    await reportRequest.save();
    res.status(201).json(reportRequest);
});

const updateReportRequest = asyncHandler(async (req: Request, res: Response) => {
    const reportId = req.params.id;
    const { farmer, officer, details } = req.body;
    const reportRequest = await ReportRequest.findByIdAndUpdate(reportId, { farmer, officer, details }, { new: true, runValidators: true });
    if (!reportRequest) {
        return res.status(404).json({ message: 'Report request not found' });
    }
    res.json(reportRequest);
});

const deleteReportRequest = asyncHandler(async (req: Request, res: Response) => {
    const reportId = req.params.id;
    const reportRequest = await ReportRequest.findByIdAndDelete(reportId);
    if (!reportRequest) {
        return res.status(404).json({ message: 'Report request not found' });
    }
    res.json({ message: 'Report request deleted successfully' });
});

const reportController = {
    getReportRequests,
    getReportRequestById,
    generateReportWithAI,
    createReportRequest,
    updateReportRequest,
    deleteReportRequest
};

export default reportController;