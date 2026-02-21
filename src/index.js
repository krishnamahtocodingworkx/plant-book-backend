import { MONGODB_URL, PORT } from "./utils/config.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import mainRoutes from "./routes/index.route.js";
import dbConnect from "./utils/dbConnect.js";

const app = express();
// Middleware
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use((req, res, next) => {
  console.log("----- API Request -----");
  console.log("Method:", req.method);
  console.log("URL:", req.originalUrl);
  console.log("Body:", req.body);
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  console.log("Time:", new Date().toISOString());
  console.log("-----------------------");
  next();
});

// Routes
app.use("/api/v1/", mainRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Plant Book API",
    code: 200,
    data: {},
  });
});

dbConnect();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
