import mongoose, { Schema, model, InferSchemaType } from 'mongoose';

const sessionSchema = new Schema(
    {
        teacherId: {
            type: Schema.Types.ObjectId,
            ref: 'Teacher',
            required: true,
            trim: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            trim: true,
        },
        startTime: {
            type: Date,
            required: true,
            trim: true,
        },
        endTime: {
            type: Date,
            required: true,
            trim: true,
        },
        status: {
            type: String,
            enum: ['AVAILABLE', 'BOOKED', 'COMPLETED'],
            default: 'AVAILABLE'
        },
        completedAt: {
            type: Date,
            trim: true,
        },
    },
    {
        timestamps: true
    }
)


export type Session = InferSchemaType<typeof sessionSchema>;

export const SessionModel = model("Session", sessionSchema)