import { Express, json, urlencoded } from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJson from "../swagger.json" assert { type: "json" };

export default (app: Express) => {
  app.use(
    morgan("dev"),
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    }),
    json({ limit: "50mb" }),
    urlencoded({ extended: true })
  );
  app.use("/api-docs", swaggerUi.serve);
  app.get("/api-docs", swaggerUi.setup(swaggerJson));
};
