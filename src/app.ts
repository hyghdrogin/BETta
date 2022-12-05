/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-namespace */
import express from "express";
import cors from "cors";
import config from "./config";
import connection from "./config/db";
import userRoutes from "./routes/userRoute";
import { CustomRequest } from "./utils/interface";

const app = express();
const port = config.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/users", userRoutes);

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
  await connection.sync();
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
