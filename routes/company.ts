import { Router } from "express";
const router = Router();
import { myCompanyController } from "../controllers";
import { authMiddleware } from "../middlewares";
router
  .route("/")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCompany,
    myCompanyController.getMyCompany
  )
  .put(authMiddleware.verifyToken, myCompanyController.updateMyCompany);
router
  .route("/job")
  .get(
    authMiddleware.verifyToken,
    authMiddleware.verifyCompany,
    myCompanyController.getListJob
  )
  .post(
    authMiddleware.verifyToken,
    authMiddleware.verifyCompany,
    myCompanyController.updateJob
  )
  .put(
    authMiddleware.verifyToken,
    authMiddleware.verifyCompany,
    myCompanyController.updateJob
  );
export default router;
