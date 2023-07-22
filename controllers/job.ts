import validator from "validator";
import { Types } from "mongoose";
import { ControllerType, RequestWithPayload } from "../types";
import {
  IJob,
  CompanyDocument,
  Job,
  User,
  CV,
  UserDocument,
  JobDocument,
  Company,
  Apply,
} from "../models";
import { validate, jobValidator } from "../utils";
import { log } from "console";
//declare controller methods here
type Methods =
  | "create"
  | "getSuitableCandidates"
  | "getSuitableJobs"
  | "applyJob"
  | "getJob"
  | "getCandidates"
  | "acceptCandidate"
  | "rejectCandidate"
  | "setSchedules"
  | "bookSchedule";
const jobController: ControllerType<Methods> = {
  create: async (req: RequestWithPayload, res) => {
    try {
      const company = <CompanyDocument>req.payload?.company;
      const body: IJob = req.body;
      const error = await validate(jobValidator, body);
      if (error) throw error;
      const job = await Job.create({ ...body, company: company._id });
      company.jobs.push(job._id);
      await company.save();
      res.json({ success: true, data: { job } });
    } catch (error: any) {
      if (typeof error === "string") {
        res.status(400).json({ success: false, message: error });
        return;
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },
  getSuitableCandidates: async (req: RequestWithPayload, res) => {
    try {
      const jobId = req.params.jobId;
      if (!validator.isMongoId(jobId)) throw "Invalid job id";
      const job = await Job.findById(jobId);
      if (!job) throw "Job not found";
      const tags = job.tags;
      const results = await User.find({ tags: { $in: tags } });
      const candidates = await Promise.all(
        results.map(async (candidate) => {
          const { password, cv: cvId, ...rest } = candidate.toJSON();
          const cv = await CV.findById(cvId);
          return { ...rest, cv };
        })
      );

      // const
      res.json({ success: true, data: { candidates } });
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(400).json({ success: false, message: error });
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  getSuitableJobs: async (req: RequestWithPayload, res) => {
    try {
      const candidate = <UserDocument>req.payload?.candidate;
      const definedTags = req.body.tags as string[];
      const tags = definedTags ?? candidate.tags;
      const results = await Job.find({
        tags: { $in: tags },
      });
      const companyJobs: {
        company: CompanyDocument;
        jobs: JobDocument[];
      }[] = [];
      const callback = async (job: JobDocument) => {
        let existCompany = companyJobs.find((c) => {
          return c.company._id.toString() == job.company.toString();
        });
        if (!existCompany) {
          const companyInfo = await Company.findById(job.company);
          if (!companyInfo) throw Error("company notfound! database error");
          const company = {
            company: companyInfo,
            jobs: [job],
          };
          companyJobs.push(company);
          return;
        }
        existCompany.jobs.push(job);
      };
      for (const job of results) {
        await callback(job);
      }
      res.json({ success: true, data: { companyJobs } });
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(400).json({ success: false, message: error });
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  applyJob: async (req: RequestWithPayload, res) => {
    try {
      const id = req.payload?.id;
      const jobId = req.params.jobId;
      const isApplied = await Apply.findOne({ job: jobId, user: id });
      if (isApplied) {
        res
          .status(403)
          .json({ message: "You applied this job", type: "applied" });
        return;
      }
      const apply = await Apply.create({ job: jobId, user: id });
      res.status(201).json({ apply });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  getCandidates: async (req: RequestWithPayload, res) => {
    try {
      const jobId = req.params.jobId;
      if (!jobId) return;
      const candidates = await Apply.aggregate([
        {
          $match: {
            job: new Types.ObjectId(jobId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
          },
        },
        {
          $lookup: {
            from: "cvs",
            localField: "user.cv",
            foreignField: "_id",
            pipeline: [
              {
                $unset: ["password", "__v"],
              },
            ],
            as: "cv",
          },
        },
        {
          $unwind: {
            path: "$cv",
          },
        },
        {
          $addFields: {
            "user.cv": "$cv",
            "user.status": "$status",
            "user.bookSchedule": "$bookSchedule",
          },
        },
        {
          $group: {
            _id: "$job",
            users: {
              $push: "$user",
            },
          },
        },
      ]);
      res.status(201).json({ candidates: candidates[0]?.users || [] });
    } catch (error) {
      console.log(error);

      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  getJob: async (req: RequestWithPayload, res) => {
    try {
      const id = req.params.id;
      const job = await Job.findById(id);
      if (!job) throw "Can not find job";
      return res.json({ success: true, data: job });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  acceptCandidate: async (req: RequestWithPayload, res) => {
    try {
      console.log("test");

      const { jobId, userId, schedules } = req.body;

      const apply = await Apply.findOne({ job: jobId, user: userId });

      if (!apply)
        return res
          .status(400)
          .json({ success: false, message: "Can not find apply" });
      apply.status = "accept";
      if (schedules) {
        apply.schedule = schedules;
      }
      await apply.save();

      return res.json({ success: true, data: apply });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  rejectCandidate: async (req: RequestWithPayload, res) => {
    try {
      const { jobId, userId } = req.body;
      const apply = await Apply.findOne({ job: jobId, user: userId });
      if (!apply)
        return res
          .status(400)
          .json({ success: false, message: "Can not find apply" });
      apply.status = "reject";
      await apply.save();

      return res.json({ success: true, data: apply });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  setSchedules: async (req: RequestWithPayload, res) => {
    try {
      const { jobId, userId } = req.body;
      log(userId, jobId);
      const apply = await Apply.findOne({ user: userId, job: jobId });
      if (!apply)
        return res
          .status(400)
          .json({ success: false, message: "Can not find apply" });
      apply.schedule = req.body.schedules;
      await apply.save();
      return res.json({ success: true, data: apply });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
  bookSchedule: async (req: RequestWithPayload, res) => {
    try {
      const { jobId, userId } = req.body;
      const apply = await Apply.findOne({ job: jobId, user: userId });
      if (!apply)
        return res
          .status(400)
          .json({ success: false, message: "Can not find apply" });
      apply.bookSchedule = req.body.schedule;
      await apply.save();
      return res.json({ success: true, data: apply });
    } catch (error) {
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
};

export default jobController;
