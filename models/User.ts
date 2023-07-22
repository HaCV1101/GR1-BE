import { Model, Schema, model, Types, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
interface IUser {
  email: string;
  password: string;
  fullname: string;
  phone: string;
  address?: string;
  avatar?: string;
  tags: string[];
  cv?: Types.ObjectId;
}
interface IUserMethods {
  saveWithHashedPassword(this: UserDocument): Promise<UserDocument>;
  generateToken(this: UserDocument): Promise<string>;
  checkPassword(this: UserDocument, password: string): Promise<boolean>;
}
interface UserModel extends Model<IUser, {}, IUserMethods> {
  isExisted(email: string, phone: string): Promise<boolean>;
  findByEmail(email: string): Promise<UserDocument | null>;
}
const schema = new Schema<IUser, UserModel, IUserMethods>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    address: { type: String },
    avatar: { type: String },
    tags: [String],
    cv: { type: Types.ObjectId, ref: "CV" },
  },
  { timestamps: true }
);

schema.methods.saveWithHashedPassword = async function () {
  const user = this;
  const SALT_ROUND = 10;
  const hashedPassword = await bcrypt.hash(user.password, SALT_ROUND);
  user.password = hashedPassword;
  return await user.save();
};
schema.methods.generateToken = async function () {
  const user = this;
  const SECRET_KEY = process.env.JWT_SECRET_KEY as string;
  const token = jwt.sign({ id: user._id }, SECRET_KEY, {
    expiresIn: "1d",
  });
  return token;
};
schema.methods.checkPassword = async function (password: string) {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

schema.statics.isExisted = async function (email: string, phone: string) {
  const user = await this.findOne({ $or: [{ email }, { phone }] });
  return !!user;
};

schema.statics.findByEmail = async function (email: string) {
  const user = await this.findOne({ email });
  return user;
};
const User = model<IUser, UserModel>("User", schema);
export type UserDocument = Document<unknown, {}, IUser> &
  Omit<
    IUser & {
      _id: Types.ObjectId;
    },
    keyof IUserMethods
  > &
  IUserMethods;
export default User;
