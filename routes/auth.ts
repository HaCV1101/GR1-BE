import { Router } from "express";
const router = Router();
import { authController } from "../controllers";
//Candidate
router.post("/candidate/login", authController.loginCandidate);
router.post("/candidate/signup", authController.signupCandidate);
//Company
router.post("/company/login", authController.loginCompany);
router.post("/company/signup", authController.signupCompany);
export default router;
