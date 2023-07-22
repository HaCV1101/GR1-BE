import { ControllerType, RequestWithPayload } from "../types";
import { User, UserDocument, CV, CVDocument, Apply } from "../models";
import { validate, userValidator, CVValidator } from "../utils";
import { Types } from "mongoose";
type Methods =
  | "getMe"
  | "updateMe"
  | "getCV"
  | "updateCV"
  | "getJobPendding"
  | "getJobAccepted"
  | "getJobRejected";
const meController: ControllerType<Methods> = {
  getMe: async (req: RequestWithPayload, res) => {
    try {
      const candidate = <UserDocument>req.payload?.candidate;
      const { password, ...rest } = candidate.toObject();
      res.json({ success: true, data: { user: rest } });
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(400).json({ success: false, message: error });
      console.log(error);

      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  updateMe: async (req: RequestWithPayload, res) => {
    try {
      const { email, fullname, phone, address } = req.body;
      const body = { email, fullname, phone, address };
      const error = await validate(userValidator, body, [
        "email",
        "fullname",
        "phone",
        "address",
      ]);
      if (error) {
        throw error;
      }
      const user = await User.findByIdAndUpdate(req.payload?.id, body, {
        new: true,
      });
      if (!user) {
        throw "User not found";
      }
      const { password, ...rest } = user.toObject();
      res.json({ success: true, data: { user: rest } });
    } catch (error: any) {
      if (typeof error === "string")
        res.status(400).json({ success: false, message: error });
    }
    res.status(500).json({ success: false, message: "Something went wrong!" });
  },
  getCV: async (req: RequestWithPayload, res) => {
    // TODO:
    try {
      const candidate = <UserDocument>req.payload?.candidate;
      const cvId = candidate.cv;
      if (!cvId) throw "You have not created your CV yet";
      const cv = await CV.findById(cvId);
      if (!cv) throw "CV not found";
      res.json({ success: true, data: { cv } });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  updateCV: async (req: RequestWithPayload, res) => {
    try {
      const body = req.body;
      const candidate = <UserDocument>req.payload?.candidate;
      console.log(candidate);

      const cvId = candidate.cv;
      const error = await validate(CVValidator, body);
      if (error) throw error;
      if (!cvId) {
        const cv = await CV.create(body);
        candidate.cv = cv._id;
        await candidate.save();
        return res.json({ success: true, data: { cv } });
      }
      const cv = await CV.findByIdAndUpdate(cvId, body, { new: true });
      if (!cv) {
        candidate.cv = undefined;
        await candidate.save();
        throw "CV not found";
      }
      res.json({ success: true, data: { cv } });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  getJobPendding: async (req: RequestWithPayload, res) => {
    try {
      const candidate = <UserDocument>req.payload?.candidate;
      const jobPenddings = await Apply.aggregate([
        {
          $match: {
            status: "reject",
            user: new Types.ObjectId(candidate._id),
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "job",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: {
            path: "$job",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "job.company",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: {
            path: "$company",
          },
        },
        {
          $unset: "company.password",
        },
      ]);
      if (!jobPenddings) {
        res.status(400).json({ message: "Khong co job dang cho" });
        return;
      }
      res.status(200).json({ jobPenddings });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  getJobAccepted: async (req: RequestWithPayload, res) => {
    try {
      const candidate = <UserDocument>req.payload?.candidate;
      const getJobAccepted = await Apply.aggregate([
        {
          $match: {
            status: "accept",
            user: new Types.ObjectId(candidate._id),
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "job",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: {
            path: "$job",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "job.company",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: {
            path: "$company",
          },
        },
        {
          $unset: "company.password",
        },
      ]);
      if (!getJobAccepted) {
        res.status(400).json({ message: "Khong co job nao duoc chap nhan" });
        return;
      }
      res.status(200).json({ getJobAccepted });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  getJobRejected: async (req: RequestWithPayload, res) => {
    try {
      const candidate = <UserDocument>req.payload?.candidate;
      const getJobRejected = await Apply.aggregate([
        {
          $match: {
            status: "reject",
            user: new Types.ObjectId(candidate._id),
          },
        },
        {
          $lookup: {
            from: "jobs",
            localField: "job",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: {
            path: "$job",
          },
        },
        {
          $lookup: {
            from: "companies",
            localField: "job.company",
            foreignField: "_id",
            as: "company",
          },
        },
        {
          $unwind: {
            path: "$company",
          },
        },
        {
          $unset: "company.password",
        },
      ]);
      if (!getJobRejected) {
        res.status(400).json({ message: "Khong co job nao bi tu choi" });
        return;
      }
      res.status(200).json({ getJobRejected });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
};
export default meController;
