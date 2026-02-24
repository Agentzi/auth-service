import express from "express";
import http from "http";
import cors from "cors";
import db from "./config/db.config";
import AuthRoutes from "./routes/auth.routes";
const PORT = parseInt(process.env.PORT);
const app = express();
const server = http.createServer(app);
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", AuthRoutes);
server.listen(PORT, () => {
    console.log("🟢 Server is running...");
    if (db) {
        console.log("🟢 Database is healthy...");
    }
    else {
        console.log("🔴 Error with the Database...");
    }
});
