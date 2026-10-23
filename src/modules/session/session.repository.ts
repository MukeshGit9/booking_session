import { SessionModel } from "./session.model.js";
import { createSessionValidation } from "./session.validation.js";

export const sessionRepo = {
    create: (data: createSessionValidation) => {
        return SessionModel.create(data);
    },

    getAvailableByDate: async (startDate: Date, endDate: Date) => {
        return await SessionModel.aggregate([
            {
                $match: {
                    status: 'AVAILABLE',
                    startTime: {
                        $gte: startDate,
                        $lt: endDate
                    }
                }
            },
            {
                $sort: {
                    startTime: 1
                }
            }
        ])
    },

    findById: async (sessionId: string) => {
        return await SessionModel.findById(sessionId)
    },

    bookAvailable: async (sessionId: string, userId: string) => {
        return await SessionModel.findOneAndUpdate(
            {
                _id: sessionId,
                status: "AVAILABLE"
            },
            {
                $set: {
                    status: "BOOKED",
                    userId: userId
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
    },

    markCompleted: async (sessionId: string) => {
        return await SessionModel.findOneAndUpdate(
            {
                _id: sessionId,
                status: "BOOKED"
            },
            {
                $set: {
                    status: "COMPLETED",
                    completedAt: new Date()
                }
            },
            {
                new: true,
                runValidators: true
            }
        )
    }

}