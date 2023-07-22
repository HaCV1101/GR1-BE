import { Model, Schema, model, Types, Document } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
interface ICompany {
  //declare model properties here
  //example: `name: string`
  name: string;
  email: string;
  phone: string;
  password: string;
  cover: string;
  avatar: string;
  introCompany: string;
  contacts: {
    address: string;
    phone: string;
    email: string;
    homepage: string;
  };
  jobs: Types.ObjectId[];
}
interface ICompanyMethods {
  //declare instance method here
  //example: `getName(): string`
  saveWithHashedPassword(this: CompanyDocument): Promise<CompanyDocument>;
  generateToken(this: CompanyDocument): Promise<string>;
  checkPassword(this: CompanyDocument, password: string): Promise<boolean>;
}
interface CompanyModel extends Model<ICompany, {}, ICompanyMethods> {
  //declare static method here
  //example: `createInstance(): Instance`
  isExisted(email: string, phone: string): Promise<boolean>;
  findByEmail(email: string): Promise<CompanyDocument | null>;
}
const schema = new Schema<ICompany, CompanyModel, ICompanyMethods>(
  {
    //implement model properties here
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    password: { type: String, required: true },
    cover: { type: String },
    avatar: { type: String },
    introCompany: { type: String },
    contacts: {
      address: { type: String },
      phone: { type: String },
      email: { type: String },
      homepage: { type: String },
    },
    jobs: [{ type: Types.ObjectId, ref: "Job" }],
  },
  { timestamps: true }
);

schema.methods.saveWithHashedPassword = async function () {
  const company = this;
  const SALT_ROUND = 10;
  const hashedPassword = await bcrypt.hash(company.password, SALT_ROUND);
  company.password = hashedPassword;
  return await company.save();
};
schema.methods.generateToken = async function () {
  const company = this;
  const SECRET_KEY = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign({ id: company._id }, SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
schema.methods.checkPassword = async function (password: string) {
  const company = this;
  return await bcrypt.compare(password, company.password);
};

schema.statics.isExisted = async function (email: string, phone: string) {
  const company = await this.findOne({ $or: [{ email }, { phone }] });
  return !!company;
};

schema.statics.findByEmail = async function (email: string) {
  const company = await this.findOne({ email });
  return company;
};
const Company = model<ICompany, CompanyModel>("Company", schema);
export type CompanyDocument = Document<unknown, {}, ICompany> &
  Omit<
    ICompany & {
      _id: Types.ObjectId;
    },
    keyof ICompanyMethods
  > &
  ICompanyMethods;
export default Company;
