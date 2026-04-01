import { Router } from "express";
import { recordController } from "../controllers";
import { requireAuth, requireRole, validate } from "../middleware";
import {
  createRecordSchema,
  deleteRecordSchema,
  getRecordByIdSchema,
  getRecordsSchema,
  updateRecordSchema,
} from "../validations";

const router = Router();

// All record routes require authentication
router.use(requireAuth);
// Only analysts and admins can manage records
router.use(requireRole(["analyst", "admin"]));

router.post("/", validate(createRecordSchema), recordController.createRecord);
router.get("/", validate(getRecordsSchema), recordController.getAllRecords);
router.get(
  "/:id",
  validate(getRecordByIdSchema),
  recordController.getRecordById,
);
router.patch(
  "/:id",
  validate(updateRecordSchema),
  recordController.updateRecord,
);
router.delete(
  "/:id",
  validate(deleteRecordSchema),
  recordController.deleteRecord,
);

export default router;
