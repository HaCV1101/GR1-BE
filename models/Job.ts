import { Model, Schema, model, Types, Document } from "mongoose";
export interface IJob {
  name: string;
  career: string;
  info: string;
  tags: string[];
  require: { title: string; skills: string[] }[];
  salary: number;
  recruitmentTime: string;
  jobType: string;
  address: string;
  contactPhone: string;
  contactEmail: string;
  contactName: string;
  other: string;
  numOfApplicants: number;
  company: Types.ObjectId;
}
interface IJobMethods {}
interface JobModel extends Model<IJob, {}, IJobMethods> {}
const schema = new Schema<IJob, JobModel, IJobMethods>(
  {
    //implement model properties here
    name: { type: String },
    career: { type: String },
    tags: [String],
    info: { type: String },
    require: [
      {
        title: { type: String },
        skills: [{ type: String }],
      },
    ],
    salary: { type: Number },
    recruitmentTime: { type: String },
    jobType: { type: String },
    address: { type: String },
    contactPhone: { type: String },
    contactEmail: { type: String },
    contactName: { type: String },
    other: { type: String },
    numOfApplicants: { type: Number, default: 0 },
    company: Types.ObjectId,
  },
  { timestamps: true }
);

const Job = model<IJob, JobModel>("Job", schema);
export type JobDocument = Document<unknown, {}, IJob> &
  Omit<
    IJob & {
      _id: Types.ObjectId;
    },
    keyof IJobMethods
  > &
  IJobMethods;
export default Job;
// const job = new Job({
//   name: "Nhân viên kinh doanh",
//   career: "Kinh doanh",
//   info: "Tìm kiếm khách hàng tiềm năng",
//   require: [
//     {
//       title: "Kỹ năng",
//       skill: ["Giao tiếp", "Kỹ năng bán hàng"],
//     },
//     {
//       title: "Kinh nghiệm",
//       skill: ["1 năm"],
//     },
//   ],
//   salary: "10.000.000",
//   recruitmentTime: "30/10/2020",
//   type: "Fulltime",
//   address: "Hà Nội",
//   other: "Có thể làm việc tại nhà",
// });
