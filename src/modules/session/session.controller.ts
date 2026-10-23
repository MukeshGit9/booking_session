import { NextFunction, Request, Response } from "express";
import { sessionService } from "./session.service.js";
import { string, success } from "zod";
import { appError } from "../../utils/appError.js";

export const createSessionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await sessionService.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Session created successfully!",
            data: result
        });
    } catch (error) {
        next(error)
    }
}

export const getAvailableByDateController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const rawTimeStamp = req.query.dateTimestamp;
        if (typeof rawTimeStamp !== "string" || rawTimeStamp.trim() === "") {
            throw appError("dateTimestamp query parameter is required", 400)
        }

        const dateTimestamp = Number(rawTimeStamp);
        if (!Number.isSafeInteger(dateTimestamp)) {
            throw appError("Invalid dateTimestamp", 400)
        }

        const sessions = await sessionService.getAvailableByDate(dateTimestamp);
        return res.status(200).json({
            success: true,
            count: sessions.length,
            data: sessions
        })
    } catch (error) {
        next(error)
    }
}

export const bookAvailableSessionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        if (typeof id !== 'string' || typeof userId !== 'string' || !userId.trim()) {
            console.log("inside if")
            throw appError("Session ID and userId is required", 400)
        }

        const result = await sessionService.book(id as string, userId as string);

        return res.status(200).json({
            success: true,
            message: "Session booked successfully!",
            data: result
        })

    } catch (error) {
        next(error)
    }
}

export const markSessionCompletedController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.params;

        if (typeof id !== "string" || !id.trim()) {
            return res.status(400).json({
                success: false,
                message: "Session ID is required",
            });
        }

        const result = await sessionService.markCompleted(id);

        return res.status(200).json({
            success: true,
            message: "Session marked as completed successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
}