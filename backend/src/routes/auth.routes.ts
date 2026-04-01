import { Router } from "express";
import { authController } from "../controllers";
import { authLimiter, validate } from "../middleware";
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema,
} from "../validations";

const router = Router();

router.post(
  "/register",
  authLimiter,
  validate(registerSchema),
  authController.register,
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post(
  "/refresh",
  validate(refreshTokenSchema),
  authController.refreshToken,
);

export default router;
