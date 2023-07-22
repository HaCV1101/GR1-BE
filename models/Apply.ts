import { Model, Schema, model, Document } from "mongoose";
interface IApply {
  job: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  status: "pending" | "accept" | "reject";
  schedule?: string[];
  bookSchedule?: string;
}
interface IApplyMethods {}
interface ApplyModel extends Model<IApply, {}, IApplyMethods> {}
const schema = new Schema<IApply, ApplyModel, IApplyMethods>({
  job: { type: Schema.Types.ObjectId, required: true },
  user: { type: Schema.Types.ObjectId, required: true },
  status: {
    type: String,
    enum: ["pending", "accept", "reject"],
    default: "pending",
  },
  schedule: [String],
  bookSchedule: String,
});

const Apply = model<IApply, ApplyModel>("Apply", schema);
export type ApplyDocument = Document<unknown, {}, IApply> &
  Omit<
    IApply & {
      _id: Schema.Types.ObjectId;
    },
    keyof IApplyMethods
  > &
  IApplyMethods;
export default Apply;
