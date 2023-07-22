import validator from "validator";
export const userValidator = {
  // username: async (v?: string) => {
  //   if (!v) return "Username is required";
  //   if (!/^[a-zA-Z0-9]+$/.test(v)) return "Username is not valid";
  //   if (validator.isLength(v, { min: 6, max: 32 }))
  //     return "Username must be between 6 and 32 characters";
  //   return false;
  // },
  fullname: async (v?: string) => {
    if (!v) return "Fullname is required";
    return false;
  },
  name: async (v?: string) => {
    if (!v) return "name is required";
    return false;
  },
  email: async (v?: string) => {
    if (!v) return "Email is required";
    if (!validator.isEmail(v)) return "Email is not valid";
    return false;
  },
  phone: async (v?: string) => {
    if (!v) return "Phone is required";
    if (!validator.isMobilePhone(v, "vi-VN"))
      return "Phone is not valid (ex: 0987654321)";
    return false;
  },
  password: async (v?: string) => {
    if (!v) return "Password is required";
    if (!validator.isLength(v, { min: 6, max: 32 }))
      return "Password must be between 6 and 32 characters";
    return false;
  },
  // role: async (v?: string) => {
  //   if (v && !["admin", "user", "driver"].includes(v))
  //     return "Role must be admin, user or driver. Default is user";
  //   return false;
  // },
  address: async (v?: string) => {
    if (!v) return "Address is required";
    return false;
  },
};
// export type UserValidator = typeof userValidator;
// export async function validateUser(
//   payload: any,
//   paths: (keyof typeof userValidator)[]
// ) {
//   for (const path of paths) {
//     const error = await userValidator[path](payload[path]);
//     if (error) return error;
//   }
//   return false;
// }
const TAGS = ["reactjs", "react-native", "nodejs", "php", "devops", "java"];
export const companyValidator = {
  name: async (v?: string) => {
    if (!v) return "Name is required";
    return false;
  },
  email: userValidator.email,
  phone: userValidator.phone,
  password: userValidator.password,
};
// name: string;
// career: string;
// info: string;
// require: { title: string; skill: string[] }[];
// salary: string;
// recruitmentTime: string;
// jobType: string;
// address: string;
// other: string;
// numOfApplicants: number;
// company: Types.ObjectId;
export const jobValidator = {
  name: async (v?: string) => {
    if (!v) return "Name is required";
    return false;
  },
  career: async (v?: string) => {
    if (!v) return "Career is required";
    return false;
  },
  // info: async (v?: string) => {
  //   if (!v) return "Info is required";
  //   return false;
  // },
  tags: async (v?: string[]) => {
    try {
      if (!v) return false;
      if (!Array.isArray(v)) {
        throw "Tags must me array";
      }
      for (const tag of v) {
        if (!TAGS.includes(tag)) {
          throw "Tag must be in the list: " + TAGS.toString();
        }
      }
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  require: async (v?: { title: string; skills: string[] }[]) => {
    if (!v) return "Require is required";
    try {
      for (const item of v) {
        if (!item.title) throw "Require title is required";
        if (!item.skills) throw "Require skills is required";
        if (!Array.isArray(item.skills)) {
          throw "Require skills must be an array";
        }
        for (const skill of item.skills) {
          if (!skill) throw "Require skill is required";
        }
      }
      return false;
    } catch (error: any) {
      return error;
    }
  },
  salary: async (v?: string | number) => {
    try {
      if (!v) throw "Salary is required";
      if (validator.isInt(v.toString()) && parseInt(v.toString()) > 0) {
        return false;
      }
      throw "Salary is not valid";
    } catch (error: any) {
      return error;
    }
  },
  recruitmentTime: async (v?: string) => {
    try {
      if (!v) throw "Recruitment time is required";
      if (validator.isDate(v)) {
        return false;
      }
      throw "Recruitment time is not valid";
    } catch (error: any) {
      return <string>error;
    }
  },
  jobType: async (v?: string) => {
    try {
      if (!v) throw "Job type is required";
      if (["fulltime", "parttime"].includes(v)) {
        return false;
      }
      throw "Job type is not valid";
    } catch (error: any) {
      return <string>error;
    }
  },
  address: async (v?: string) => {
    try {
      if (!v) throw "Address is required";
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  numOfApplicants: async (v?: string) => {
    try {
      if (!v) throw "Number of applicants is required";
      if (validator.isInt(v.toString()) && parseInt(v.toString()) > 0) {
        return false;
      }
      throw "Number of applicants is not valid";
    } catch (error: any) {
      return <string>error;
    }
  },
};

export const CVValidator = {
  avatar: async (v?: string) => {
    try {
      // if (!v) throw "Avatar is required";
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  goals: async (v?: string) => {
    try {
      // if (!v) throw "Goals is required";
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  skills: async (v?: { title: string; details: string[] }[]) => {
    try {
      if (!v) return false;
      for (const item of v) {
        if (!item.title) throw "Skill title is required";
        if (!item.details) throw "Skill details is required";
        if (!Array.isArray(item.details)) {
          throw "Skill details must be an array";
        }
        for (const detail of item.details) {
          if (!detail) throw "Skill detail is required";
        }
      }
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  tags: async (v?: string[]) => {
    try {
      if (!v) return false;
      if (!Array.isArray(v)) {
        throw "Tags must me array";
      }
      for (const tag of v) {
        if (!TAGS.includes(tag)) {
          throw "Tag must be in the list: " + TAGS.toString();
        }
      }
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  applyPosition: async (v?: string) => {
    try {
      // if (!v) throw "Apply position is required";
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  education: async (v?: {
    university: string;
    specialized: string;
    graduationType: string;
    period: string;
  }) => {
    try {
      // if (!v) return false;
      // if (!v.university) throw "Education university is required";
      // if (!v.specialized) throw "Education specialized is required";
      // if (!v.graduationType) throw "Education graduation type is required";
      // if (!v.period) throw "Education period is required";
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  experiences: async (v?: {
    position: string;
    company: string;
    period: string;
  }) => {
    try {
      // if (!v) throw "Experience is required";
      // if (!v.position) throw "Experience position is required";
      // if (!v.company) throw "Experience company is required";
      // if (!v.period) throw "Experience period is required";
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  hobbies: async (v?: string[]) => {
    try {
      if (!v) return false;
      if (!Array.isArray(v)) throw "Hobbies must be an array";
      for (const item of v) {
        if (!item) throw "Hobby is required";
      }
      return false;
    } catch (error: any) {
      return <string>error;
    }
  },
  contacts: async (v?: {
    birthday: string;
    gender: string;
    address: string;
    phone: string;
    mail: string;
    github: string;
  }) => {
    try {
      // if (!v) throw "Contacts is required";
      // if (!v.birthday) throw "Contacts birthday is required";
      // if (!v.gender) throw "Contacts gender is required";
      // if (!v.address) throw "Contacts address is required";
      // if (!v.phone) throw "Contacts phone is required";
      // if (!v.mail) throw "Contacts mail is required";
      // if (!v.github) throw "Contacts github is required";
      return false;
    } catch (error) {
      return <string>error;
    }
  },
};

export default async function validate<
  T extends Record<string, (v?: any) => Promise<string | false>>
>(validator: T, payload: { [key in keyof T]?: any }, paths?: (keyof T)[]) {
  if (!paths) paths = <(keyof T)[]>Object.keys(validator);
  for (const path of paths) {
    const error = await validator[path](payload[path]);
    if (error) return error;
  }
  return false;
}
