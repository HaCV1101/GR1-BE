type UserT = {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  avatar: string;
  cv: CV;
};
type CV = {
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
    gendle: string;
    address: string;
    phone: string;
    mail: string;
    github: string;
  };
};

type companyT = {
  name: string;
  email: string;
  hotline: string;
  password: string;
  cover: string;
  avatar: string;
  introCompany: string;
  contacts: {
    address: string;
    hotline: string;
    email: string;
    homepage: string;
  };
  jobs: job[];
};

type job = {
  nameJob: string;
  detail: detail;
  numOfApplicants: number;
};
type Apply = {
  job: job;
  user: UserT;
  schedule: string;
};

type detail = {
  inforJob: string;
  request: { skill: string[] }[];
  salary: string;
  recruitmentTime: string;
  jobType: string;
  address: string;
};
