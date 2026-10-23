import { User } from "./user.types.js";
import { userRepo } from "./user.repository.js";
import mongoose from "mongoose";
import { appError } from "../../utils/appError.js";
import { UserModel } from "./user.model.js";

export const userService = {
    create: async (data: User) => {
        const result = await userRepo.create(data);
        return result;
    },

    getUsersSessions: async (userId: string,) => {
        if (!mongoose.isValidObjectId(userId)) {
            throw appError("Invalid user ID", 400);
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            throw appError("User does not exist", 404)
        }

        const currentTime = new Date();

        return await userRepo.getUserSessions(userId, currentTime)
    }
}