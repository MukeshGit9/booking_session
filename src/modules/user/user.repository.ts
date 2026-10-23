import mongoose from "mongoose";
import { SessionModel } from "../session/session.model.js";
import { UserModel } from "./user.model.js";
import { User } from "./user.types.js";

export const userRepo = {
    create: (data: User) => {
        return UserModel.create(data);
    },

    getUserSessions: async (userId: string, currentTime: Date) => {
        const result = await SessionModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            }, {
                $facet: {
                    upcomingSessions: [
                        {
                            $match: {
                                status: "BOOKED",
                                startTime: { $gte: currentTime }
                            }
                        }, {
                            $sort: {
                                startTime: 1
                            }
                        }
                    ],
                    completedSessions: [
                        {
                            $match: {
                                status: "COMPLETED"
                            }
                        }, {
                            $sort: {
                                completedAt: 1
                            }
                        }
                    ]
                }
            }
        ])

        return result[0] ?? {
            upcomingSessions:[],
            completedSessions:[]
        }
    }

}