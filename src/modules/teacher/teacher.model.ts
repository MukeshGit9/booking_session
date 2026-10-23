import { Schema, model, InferSchemaType } from 'mongoose';

const teacherSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        specialization: {
            type: String,
            trim: true,
            required: true
        },
        experience: {
            type: String,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)

teacherSchema.index({ email: 1 }, { unique: true });

export type Teacher = InferSchemaType<typeof teacherSchema>;

export const TeacherModel = model("Teacher", teacherSchema)