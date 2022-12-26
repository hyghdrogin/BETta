/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import config from "./config";
import sequelize from "./config/db";
import routes from "./routes";
import reqLogger from "./utils/reqLogger";
import { CustomRequest } from "./utils/interface";

const app = express();
const port = config.PORT || 5000;

const limiter = rateLimit({
  windowMs: 0.5 * 60 * 1000, // 30s
  max: 3, // Limit each IP to 3 requests per `window` (here, per 30s)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(cors());
app.use(express.json());

app.use(limiter);
app.use(reqLogger);
app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to BETta app");
});

declare global {
  namespace Express {
    interface Request extends CustomRequest { }
  }
}

// Global 404 error handler
app.use((req, res) => res.status(404).send({
  status: "error",
  error: "Not found",
  message: "Route not correct kindly check url.",
}));

(async () => {
  process.on("warning", (e) => config.logger.warn(e.stack));
  console.log("Waiting for DATABASE Connection...");
  await sequelize.sync();
  app.listen(config.PORT || 4000, async () => {
    console.log(
      `${config.APP_NAME} API listening on ${port || 4000}`
    );
  });
})();

process.on("unhandledRejection", (error: any) => {
  console.log("FATAL UNEXPECTED UNHANDLED REJECTION!", error.message);
  console.error("\n\n", error, "\n\n");
  //  throw error;
});

export default app;
