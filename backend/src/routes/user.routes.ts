import { Router } from "express";
import { userController } from "../controllers";
import { requireAuth, requireRole, validate } from "../middleware";
import {
  getUsersSchema,
  updateRoleSchema,
  updateStatusSchema,
} from "../validations";

const router = Router();

// All user routes require authentication and admin role
router.use(requireAuth);
router.use(requireRole(["admin"]));

router.get("/", validate(getUsersSchema), userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.patch(
  "/:id/role",
  validate(updateRoleSchema),
  userController.updateUserRole,
);
router.patch(
  "/:id/status",
  validate(updateStatusSchema),
  userController.updateUserStatus,
);

export default router;
