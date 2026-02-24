import express from "express";
import http from "http";
import cors from "cors";
import db from "./config/db.config";
import cookieParser from "cookie-parser";

import AuthRoutes from "./routes/auth.routes";
import UserRoutes from "./routes/user.routes";
import HttpStatus from "./utils/http-status";

const PORT: number = parseInt(process.env.PORT);

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);
app.use(cookieParser());

app.get("/", (_, res) => {
  res.status(HttpStatus.OK).json({
    message: "🟢 Server is running...",
  });
});

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);

server.listen(PORT, () => {
  console.log("🟢 Server is running...");
  if (db) {
    console.log("🟢 Database is healthy...");
  } else {
    console.log("🔴 Error with the Database...");
  }
});
