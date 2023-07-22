import { ControllerType } from "types";
import { validate, userValidator, companyValidator } from "../utils";
import { User, Company } from "../models";
type Methods =
  | "loginCandidate"
  | "signupCandidate"
  | "loginCompany"
  | "signupCompany";
const authController: ControllerType<Methods> = {
  loginCandidate: async (req, res) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      const body = { email, password };
      const error = await validate(userValidator, body, ["email", "password"]);
      if (error) throw error;
      const user = await User.findByEmail(email);
      if (!user) {
        throw "User not found";
      }
      const isMatch = await user.checkPassword(password);
      if (!isMatch) {
        throw "Password is incorrect";
      }
      const token = await user.generateToken();
      const { password: p, ...rest } = user.toObject();
      res.json({ success: true, data: { user: rest, token } });
    } catch (error: any) {
      console.log(error);
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },
  signupCandidate: async (req, res) => {
    try {
      const { email, password, fullname, phone } = req.body;
      const body = { email, password, fullname, phone };
      const error = await validate(userValidator, body, [
        "email",
        "password",
        "fullname",
        "phone",
      ]);
      if (error) {
        throw error;
      }
      const isExisted = await User.isExisted(email, phone);
      if (isExisted) {
        throw "User is existed";
      }
      const user = new User(body);
      await user.saveWithHashedPassword();
      const { password: p, ...data } = user.toObject();
      const token = await user.generateToken();
      res.json({ success: true, data: { user: data, token } });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },
  loginCompany: async (req, res) => {
    try {
      const { email, password } = req.body;
      const body = { email, password };
      const error = await validate(companyValidator, body, [
        "email",
        "password",
      ]);
      if (error) {
        throw error;
      }
      const company = await Company.findByEmail(email);
      if (!company) {
        throw "Company not found";
      }
      const isMatch = await company.checkPassword(password);
      if (!isMatch) {
        throw "Password is incorrect";
      }
      const token = await company.generateToken();
      const { password: p, ...rest } = company.toObject();
      res.json({ success: true, data: { company: rest, token } });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },
  signupCompany: async (req, res) => {
    try {
      const { name, email, phone, password } = req.body;
      const body = { name, email, phone, password };
      const error = await validate(companyValidator, body, [
        "name",
        "email",
        "phone",
        "password",
      ]);
      if (error) {
        throw error;
      }
      const isExisted = await Company.isExisted(email, phone);
      if (isExisted) {
        throw "Company is existed";
      }
      const company = new Company(body);
      await company.saveWithHashedPassword();
      const { password: p, ...data } = company.toObject();
      const token = await company.generateToken();
      res.json({ success: true, data: { company: data, token } });
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
export default authController;
