import { Express } from "express";
import authRoute from "./auth";
import candidateRoute from "./candidate";
import jobRoute from "./job";
import myCompanyRoute from "./company";

export default function initRoutes(app: Express) {
  app.use("/api/auth", authRoute);
  app.use("/api/candidate", candidateRoute);
  app.use("/api/company", myCompanyRoute);
  app.use("/api/job", jobRoute);
  app.use("/", (req, res) => {
    res
      .status(403)
      .send(
        `No route for path <code style="background-color: #aaaaaac2; border-radius: 5px; padding: 1px 2px;">${req.path}</code> with method <strong>${req.method}</strong>`
      );
  });
}
