
type MongoDuplicateKeyError = {
    code: number;
    keyPattern?: Record<string, number>;
    keyValue?: Record<string, unknown>;
};

type DuplicateKeyResult = {
    field: string | null;
    value: unknown;
    message: string;
};

export const getDuplicateKeyError = (
    error: unknown
): DuplicateKeyResult | null => {
    if (
        typeof error !== "object" ||
        error === null ||
        !("code" in error) ||
        error.code !== 11000
    ) {
        return null;
    }

    const duplicateError = error as MongoDuplicateKeyError;

    const field = Object.keys(
        duplicateError.keyPattern ?? duplicateError.keyValue ?? {}
    )[0];

    const value = field
        ? duplicateError.keyValue?.[field]
        : undefined;

    const formatField = (key: string) =>
        key
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/[_-]/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
        field: field ?? null,
        value,
        message: field
            ? `${formatField(field)} already exists`
            : "A record with this value already exists",
    };
};
