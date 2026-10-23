import { Router } from "express";
import { userValidation } from "./user.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createUserController, getUsersSessionsController } from "./user.controller.js";

const router = Router();

router.post('/users', validate(userValidation), createUserController)
router.get('/users/:id/sessions', getUsersSessionsController)

export default router;