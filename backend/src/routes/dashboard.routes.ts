import { Router } from "express";
import { dashboardController } from "../controllers";
import { requireAuth } from "../middleware";

const router = Router();

// All dashboard routes require authentication (available to all roles)
router.use(requireAuth);

router.get("/summary", dashboardController.getSummary);
router.get("/category-breakdown", dashboardController.getCategoryBreakdown);
router.get("/trends", dashboardController.getMonthlyTrends);
router.get("/recent", dashboardController.getRecentRecords);

export default router;
