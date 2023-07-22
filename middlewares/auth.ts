import jwt from "jsonwebtoken";
import { MiddlewareType, RequestWithPayload } from "../types";
import { Company, User } from "../models";
import validator from "validator";
type Methods = "verifyToken" | "verifyCompany" | "verifyCandidate";
const authMiddleware: MiddlewareType<Methods, RequestWithPayload> = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) {
        throw "Token is required";
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
      req.payload = decoded as RequestWithPayload["payload"];
      const id = req.payload?.id;
      if (!id || !validator.isMongoId(id)) {
        throw "Invalid token";
      }
      next();
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(401).json({ success: false, message: error });
      res.status(500).json({ success: false, message: error.message });
    }
  },
  verifyCompany: async (req, res, next) => {
    try {
      const companyId = req.payload?.id;
      const company = await Company.findById(companyId);
      if (!company) {
        throw "You are not a company";
      }
      req.payload!.company = company;
      next();
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(401).json({ success: false, message: error });
      res.status(500).json({ success: false, message: error.message });
    }
  },
  verifyCandidate: async (req, res, next) => {
    try {
      const candidateId = req.payload?.id;
      const candidate = await User.findById(candidateId);
      if (!candidate) {
        throw "You are not a candidate";
      }
      req.payload!.candidate = candidate;
      next();
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(401).json({ success: false, message: error });
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
export default authMiddleware;
