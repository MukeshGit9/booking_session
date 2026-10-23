import { Schema, model, InferSchemaType } from 'mongoose';

const userSchema = new Schema(
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
        phone: {
            type: Number,
            trim: true,
            required: true
        }
    },
    {
        timestamps: true
    }
)

userSchema.index({ email: 1 }, { unique: true });

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema)