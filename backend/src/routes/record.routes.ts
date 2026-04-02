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

/**
 * @swagger
 * /records:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - type
 *               - category
 *               - date
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 1500.50
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *                 example: income
 *               category:
 *                 type: string
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               notes:
 *                 type: string
 *                 example: Monthly salary payment
 *     responses:
 *       201:
 *         description: Record created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions (Viewer role)
 */
router.post("/", validate(createRecordSchema), recordController.createRecord);

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get all financial records with filtering and pagination
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [income, expense]
 *         description: Filter by record type
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records from this date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter records until this date
 *       - in: query
 *         name: includeDeleted
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include soft-deleted records
 *     responses:
 *       200:
 *         description: Records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     records:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/FinancialRecord'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                           example: 50
 *                         page:
 *                           type: integer
 *                           example: 1
 *                         limit:
 *                           type: integer
 *                           example: 10
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *       401:
 *         description: Unauthorized
 */
router.get("/", validate(getRecordsSchema), recordController.getAllRecords);

/**
 * @swagger
 * /records/{id}:
 *   get:
 *     summary: Get a financial record by ID
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/:id",
  validate(getRecordByIdSchema),
  recordController.getRecordById,
);

/**
 * @swagger
 * /records/{id}:
 *   patch:
 *     summary: Update a financial record
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Record ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 2000.00
 *               type:
 *                 type: string
 *                 enum: [income, expense]
 *               category:
 *                 type: string
 *                 example: Bonus
 *               date:
 *                 type: string
 *                 format: date
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.patch(
  "/:id",
  validate(updateRecordSchema),
  recordController.updateRecord,
);

/**
 * @swagger
 * /records/{id}:
 *   delete:
 *     summary: Soft delete a financial record
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record deleted successfully (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Record deleted successfully
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id",
  validate(deleteRecordSchema),
  recordController.deleteRecord,
);

/**
 * @swagger
 * /records/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted financial record
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/FinancialRecord'
 *       404:
 *         description: Deleted record not found
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/:id/restore",
  validate(deleteRecordSchema),
  recordController.restoreRecord,
);

/**
 * @swagger
 * /records/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a financial record
 *     tags: [Records]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Record ID
 *     responses:
 *       200:
 *         description: Record permanently deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Record permanently deleted
 *       404:
 *         description: Record not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/:id/permanent",
  validate(deleteRecordSchema),
  recordController.deleteRecordPermanently,
);

export default router;
