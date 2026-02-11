import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
import healthRouter from "./routes/health.js";
import weatherRouter from "./routes/weather.js";
import geocodeRouter from "./routes/geocode.js";

app.use("/health", healthRouter);
app.use("/geocode", geocodeRouter);
app.use("/weather", weatherRouter);

export default app;
