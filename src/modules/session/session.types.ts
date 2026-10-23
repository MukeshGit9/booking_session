import mongoose from "mongoose"

export interface Session {
    teacherId: mongoose.ObjectId;
    userId: mongoose.ObjectId | null;
    startTime: Date | string;
    endTime: Date | string;
    status: 'AVAILABLE' | 'BOOKED' | 'COMPLETED';
    completedAt: Date | string;
}
