import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import authRoutes from "./Routes/auth.routes.js";
import taskRoutes from "./Routes/task.routes.js"


import ConnectToMongoDB from "./Database/ConnectToMongoDB.js";

import errorHandler from "./Middlewares/errorHandler.middlewares.js";

const app = express();

// app.use(cors());

const corsOptions = {
    origin: "*",
  };
  app.use(cors(corsOptions));

const PORT = process.env.PORT || 5007;

dotenv.config();

app.use(express.json()); // to parse the incoming requests with JSON payloads(from req.body)

app.use("/api/auth", authRoutes);
app.use("/api/task", taskRoutes);

app.get("/", (req, res) => {
  res.send("Hello There!!, Server is running here");
});

app.use(errorHandler);

app.listen(PORT, () => {
 ConnectToMongoDB();
  console.log(`Server running on ${PORT}`);
});
