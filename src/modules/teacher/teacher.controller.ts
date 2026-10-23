import { NextFunction, Request, Response } from "express";
import { teacherService } from "./teacher.service.js";

export const createTeacherController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await teacherService.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Teacher created successfully!",
            data: result
        });
    } catch (error) {
        next(error)
    }
}