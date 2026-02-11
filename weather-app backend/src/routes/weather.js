import { Router } from "express";
import { getWeatherByCoords } from "../services/weatherService.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const { lat, lon } = req.query;

        const weather = await getWeatherByCoords(
            Number(lat),
            Number(lon)
        );

        res.json({
            weather
        });
    } catch (error) {
        res.status(400).json({
            error: error.message
        });
    }
});

export default router;
