import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import authRoute from "./route/auth.route";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // allow to server to accept request from different origin
  })
);
app.use(express.json());

// routes
app.use("/api/v1/auth", authRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
