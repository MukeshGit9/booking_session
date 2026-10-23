import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { getDuplicateKeyError } from "../utils/duplicateKeyError.js";

type AppErrorType = Error & {
    statusCode?: number;
};

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (res.headersSent) {
        return next(error);
    }

    const duplicateError = getDuplicateKeyError(error);

    if (duplicateError) {
        return res.status(409).json({
            success: false,
            message: duplicateError.message,
            field: duplicateError.field,
        });
    }

    if (error instanceof mongoose.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: "Database validation failed",
            error: error.message,
        });
    }

    if (error instanceof mongoose.Error.CastError) {
        return res.status(400).json({
            success: false,
            message: "Invalid ID or data format",
        });
    }

    if (error instanceof Error) {
        const appError = error as AppErrorType;

        if (appError.name === "AppError") {
            return res.status(appError.statusCode ?? 500).json({
                success: false,
                message: appError.message,
            });
        }
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message: "Internal server error",
    });
};