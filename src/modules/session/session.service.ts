import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { TeacherModel } from "../teacher/teacher.model.js";
import { sessionRepo } from "./session.repository.js";
import { createSessionValidation } from "./session.validation.js";
import { UserModel } from "../user/user.model.js";
import { SessionModel } from "./session.model.js";

export const sessionService = {
    create: async (data: createSessionValidation) => {
        const teacherExist = await TeacherModel.findById(data.teacherId);
        if (!teacherExist) {
            throw appError("Teacher Not Exist", 404);
        }
        const result = await sessionRepo.create(data);
        return result;
    },
    getAvailableByDate: async (dateTimestamp: number) => {
        if (!Number.isSafeInteger(dateTimestamp)) {
            throw appError("Invalid dateTimeSTamp", 400);
        }

        const date = new Date(dateTimestamp);

        if (Number.isNaN(date.getTime())) {
            throw appError("Invalid dateTimeStamp", 400)
        }

        const startOfDay = new Date(date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setUTCDate(endOfDay.getUTCDate() + 1)

        return await sessionRepo.getAvailableByDate(
            startOfDay, endOfDay
        )
    },
    book: async (sessionId: string, userId: string) => {
        if (!mongoose.isValidObjectId(sessionId)) {
            throw appError("Invalid session ID", 400)
        }

        if (!mongoose.isValidObjectId(userId)) {
            throw appError("Invalid User ID", 400)
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            throw appError("User not exist", 404)
        }

        const session = await SessionModel.findById(sessionId);
        if (!session) {
            throw appError("Session does not exist", 404)
        }

        if (session.status !== 'AVAILABLE') {
            throw appError("Session is already booked or Unavailable", 409)
        }

        const bookedSession = await sessionRepo.bookAvailable(sessionId, userId)
        if (!bookedSession) {
            throw appError("Session is already booked or Unavailable", 409)
        }

        return bookedSession;
    },

    markCompleted: async (sessionId: string) => {
        if (!mongoose.isValidObjectId(sessionId)) {
            throw appError("Invalid session ID", 400);
        }

        const session = await sessionRepo.findById(sessionId);

        if (!session) {
            throw appError("Session does not exist", 404);
        }

        if (session.status !== "BOOKED") {
            throw appError(
                "Only booked sessions can be marked as completed",
                409
            );
        }

        const completedSession =
            await sessionRepo.markCompleted(sessionId);

        if (!completedSession) {
            throw appError(
                "Session status changed. Only booked sessions can be completed",
                409
            );
        }

        return completedSession;
    },
}