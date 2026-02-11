import { Router } from "express";
import { geocodeCity } from "../services/geocodingService.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { city } = req.query;

    const results = await geocodeCity(city);

    res.json({
      geo_data: results
    });
  } catch (error) {
    console.error("GEOCODE ERROR:", error.message);
    res.status(400).json({
      error: error.message
    });
  }
});

export default router;
