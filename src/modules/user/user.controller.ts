import { NextFunction, Request, Response } from "express";
import { userService } from "./user.service.js";
import { sessionService } from "../session/session.service.js";
import { success } from "zod";

export const createUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await userService.create(req.body);

        return res.status(200).json({
            success: true,
            message: "User created successfully!",
            data: result
        });
    } catch (error) {
        next(error)
    }
}

export const getUsersSessionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        if (typeof id !== 'string' || !id.trim()) {
            return res.status(400).json({
                success: false,
                message: "UserId is required"
            })
        }

        const result = await userService.getUsersSessions(id)

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}