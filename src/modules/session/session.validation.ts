import { z } from 'zod';

export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
export const sessionStatusSchema = z.enum(['AVAILABLE', 'BOOKED', 'COMPLETED']);

export const sessionValidation = z.object({
    teacherId: objectIdSchema,
    userId: objectIdSchema.nullable().default(null),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    status: sessionStatusSchema.default("AVAILABLE"),
    completedAt: z.coerce.date().nullable().default(null),
})
    .refine(
        (data) => data.endTime > data.startTime, {
        message: "endTime muste be after startTime",
        path: ["endTime"]
    }
    )
    .refine(
        (data) => data.status !== 'AVAILABLE' || data.userId === null, {
        message: "Available sessions cannot have a userId",
        path: ["userId"],
    }
    )
    .refine(
        (data) =>
            data.status !== "BOOKED" || data.userId !== null,
        {
            message: "Booked sessions must have a userId",
            path: ["userId"],
        }
    )
    .refine(
        (data) =>
            data.status !== "COMPLETED" ||
            (data.userId !== null && data.completedAt !== null),
        {
            message:
                "Completed sessions must have a userId and completedAt",
            path: ["completedAt"],
        }
    );

export type createSessionValidation = z.infer<
    typeof sessionValidation
>