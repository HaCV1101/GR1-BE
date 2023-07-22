import { ControllerType } from "../types";
//declare controller methods here
type Methods = "get";
const CVController: ControllerType<Methods> = {
  get: async (req, res) => {
    try {
    } catch (error: any) {
      if (typeof error === "string") {
        return res.status(400).json({ success: false, message: error });
      }
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  },
};
export default CVController;
