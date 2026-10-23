import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { teacherValidation } from "./teacher.validation.js";
import { createTeacherController } from "./teacher.controller.js";

const router = Router();

router.post('/teachers', validate(teacherValidation), createTeacherController )

export default router;