
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const shape = schema.shape;
      const receivedBody = req.body ?? {};
      const issues = result.error.issues;

      const errors = issues.map((issue) => {
        const field = issue.path.join(".");

        // Detect a field with incorrect capitalization
        const expectedField = Object.keys(shape).find(
          (key) => key.toLowerCase() === field.toLowerCase()
        );

        if (
          issue.code === "invalid_type" &&
          expectedField &&
          !(expectedField in receivedBody)
        ) {
          return {
            field: expectedField,
            message: `Field "${expectedField}" is required. Check the spelling and capitalization of your payload.`,
            code: "missing_field",
          };
        }

        return {
          field: field || "_root",
          message: issue.message,
          code: issue.code,
        };
      });

      // Detect unrecognized keys such as "Phone"
      const unknownFields = Object.keys(receivedBody).filter(
        (key) => !(key in shape)
      );

      for (const key of unknownFields) {
        const expectedField = Object.keys(shape).find(
          (field) => field.toLowerCase() === key.toLowerCase()
        );

        errors.push({
          field: key,
          message: expectedField
            ? `Unknown field "${key}". Did you mean "${expectedField}"?`
            : `Unknown field "${key}" is not accepted.`,
          code: "unrecognized_field",
        });
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check the fields below.",
        errors,
      });
    }

    req.body = result.data;
    next();
  };
};
