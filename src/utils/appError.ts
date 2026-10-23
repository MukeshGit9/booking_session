export const appError = (message: string, statusCode: number = 500) => {
    const error = new Error(message) as Error & {
        statusCode: number
    }

    error.statusCode = statusCode;
    error.name = "AppError";

    return error;
}