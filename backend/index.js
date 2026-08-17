import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import documentRouter from "./routes/documentRoutes.js";
dotenv.config();
import cors from 'cors'
import "./workers/documentWorker.js";
import aiRouter from "./routes/aiRouter.js";

const app = express();
const PORT = 6969;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use("/docs", documentRouter);
app.use("/ai", aiRouter);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected !!");
  })
  .catch((e) => {
    console.log("Error in db connection", e);
  });
app.listen(PORT, () => {
  console.log(`server is running at ${PORT}`);
});
