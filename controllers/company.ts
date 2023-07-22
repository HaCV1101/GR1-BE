import { ControllerType, RequestWithPayload } from "../types";
import { Company, CompanyDocument, Job } from "../models";
import { validate, jobValidator, userValidator } from "../utils";
type Methods = "getMyCompany" | "updateMyCompany" | "getListJob" | "updateJob";
const myCompanyController: ControllerType<Methods> = {
  getMyCompany: async (req: RequestWithPayload, res) => {
    try {
      const company = <CompanyDocument>req.payload?.company;
      const { password, ...rest } = company.toObject();
      res.json({ success: true, data: { company: rest } });
    } catch (error: any) {
      if (typeof error === "string")
        return res.status(400).json({ success: false, message: error });
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  updateMyCompany: async (req: RequestWithPayload, res) => {
    try {
      const { email, name, phone } = req.body;
      const body = { email, name, phone };
      const error = await validate(userValidator, body, [
        "email",
        "name",
        "phone",
      ]);
      if (error) {
        throw error;
      }
      const company = await Company.findByIdAndUpdate(req.payload?.id, body, {
        new: true,
      });
      if (!company) {
        throw "Company not found";
      }
      const { password, ...rest } = company.toObject();
      res.json({ success: true, data: { company: rest } });
    } catch (error: any) {
      if (typeof error === "string")
        res.status(400).json({ success: false, message: error });
    }
    res.status(500).json({ success: false, message: "Something went wrong!" });
  },
  getListJob: async (req: RequestWithPayload, res) => {
    try {
      const company = <CompanyDocument>req.payload?.company;
      const jobsId = company.jobs;
      const jobs = await Job.find({ _id: { $in: jobsId } });
      if (!jobs) throw "Jobs not found";
      res.json({ success: true, data: { jobs } });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res
        .status(500)
        .json({ success: false, message: "Something went wrong!" });
    }
  },
  updateJob: async (req: RequestWithPayload, res) => {
    try {
      const body = req.body;
      const company = <CompanyDocument>req.payload?.company;
      const jobsId = company.jobs;
      const error = await validate(jobValidator, body);
      if (error) throw error;
      if (!jobsId) {
        const jobs = await Job.create(body);
        company.jobs.push(jobs._id);
        await company.save();
        return res.json({ success: true, data: { jobs } });
      }
      const jobs = await Job.findByIdAndUpdate(jobsId, body, { new: true });
      if (!jobs) {
        company.jobs.push();
        await company.save();
        throw "CV not found";
      }
      res.json({ success: true, data: { jobs } });
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
export default myCompanyController;
