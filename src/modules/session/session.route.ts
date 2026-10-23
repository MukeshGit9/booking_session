import { Router } from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { sessionValidation } from "./session.validation.js";
import { bookAvailableSessionController, createSessionController, getAvailableByDateController, markSessionCompletedController } from "./session.controller.js";

const router = Router();

router.post('/sessions', validate(sessionValidation), createSessionController)
router.get('/sessions/available', getAvailableByDateController)
router.post('/sessions/:id/book', bookAvailableSessionController)
router.patch('/sessions/:id/complete', markSessionCompletedController)

export default router;