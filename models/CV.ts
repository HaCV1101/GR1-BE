import { Model, Schema, model, Types, Document } from "mongoose";
interface ICV {
  //declare model properties here
  //example: `name: string`
  avatar: string;
  goals: string;
  skills: { title: string; details: string[] }[];
  applyPosition: string;
  education: {
    university: string;
    specialized: string;
    graduationType: string;
    period: string;
  }[];
  experiences: {
    position: string;
    company: string;
    period: string;
  }[];
  hobbies: string[];
  contacts: {
    birthday: string;
    gender: string;
    address: string;
    phone: string;
    mail: string;
    github: string;
  };
}
interface ICVMethods {
  //declare instance method here
  //example: `getName(): string`
}
interface CVModel extends Model<ICV, {}, ICVMethods> {
  //declare static method here
  //example: `createInstance(): Instance`
}
const schema = new Schema<ICV, CVModel, ICVMethods>(
  {
    //implement model properties here
    avatar: { type: String },
    goals: { type: String },
    skills: [
      {
        title: { type: String },
        details: [{ type: String }],
      },
    ],
    applyPosition: { type: String },
    education: [
      {
        university: { type: String },
        specialized: { type: String },
        graduationType: { type: String },
        period: { type: String },
      },
    ],
    experiences: [
      {
        position: { type: String },
        company: { type: String },
        period: { type: String },
      },
    ],
    hobbies: [{ type: String }],
    contacts: {
      birthday: { type: String },
      gender: { type: String },
      address: { type: String },
      phone: { type: String },
      mail: { type: String },
      github: { type: String },
    },
  },
  { timestamps: true }
);

//implement instance method here
/*
example:
schema.methods.getName =  function () {
});
*/

//implement static method here
/*
example:
schema.statics.createInstance = function () {
});
*/

const CV = model<ICV, CVModel>("CV", schema);
export type CVDocument = Document<unknown, {}, ICV> &
  Omit<
    ICV & {
      _id: Types.ObjectId;
    },
    keyof ICVMethods
  > &
  ICVMethods;
export default CV;
