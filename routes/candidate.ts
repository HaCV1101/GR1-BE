import { Router } from "express";
const router = Router();
import { meController } from "../controllers";
import { authMiddleware } from "../middlewares";
router
  .route("/")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.getMe
  )
  .put(authMiddleware.verifyToken, meController.updateMe);

router
  .route("/cv")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.getCV
  )
  .post(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.updateCV
  )
  .put(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.updateCV
  );

router
  .route("/getJobPendding")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.getJobPendding
  );

router
  .route("/getJobAccepted")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.getJobAccepted
  );
router
  .route("/getJobRejected")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCandidate,
    meController.getJobRejected
  );
export default router;
