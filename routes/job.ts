import { Router } from "express";
const router = Router();
import { jobController } from "../controllers";
import { authMiddleware } from "../middlewares";
router.post(
  "/",
  authMiddleware.verifyToken,
  authMiddleware.verifyCompany,
  jobController.create
);
router.get("/:jobId/suitableCandidates", jobController.getSuitableCandidates);
router.get(
  "/suitableJobs",
  authMiddleware.verifyToken,
  authMiddleware.verifyCandidate,
  jobController.getSuitableJobs
);
router.post(
  "/:jobId/apply",
  authMiddleware.verifyToken,
  authMiddleware.verifyCandidate,
  jobController.applyJob
);
router.get("/:id", jobController.getJob);
router.get(
  "/:jobId/getCandidates",
  authMiddleware.verifyToken,
  authMiddleware.verifyCompany,
  jobController.getCandidates
);
router.post(
  "/acceptCandidate",
  authMiddleware.verifyToken,
  authMiddleware.verifyCompany,
  jobController.acceptCandidate
);
router.post(
  "/rejectCandidate",
  authMiddleware.verifyToken,
  authMiddleware.verifyCompany,
  jobController.rejectCandidate
);
router.post(
  "/setSchedules",
  authMiddleware.verifyToken,
  authMiddleware.verifyCompany,
  jobController.setSchedules
);
router.post(
  "/bookSchedule",
  authMiddleware.verifyToken,
  authMiddleware.verifyCandidate,
  jobController.bookSchedule
);
export default router;
