import express from "express";

const app = express();
const PORT = 3000;

app.get("/api/geocode", async (req, res) => {
  const city = req.query.q;

  if (!city) {
    return res.status(400).json({ error: "Missing city query" });
  }

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(city)}` +
    `&key=${process.env.GOOGLE_GEOCODING_API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  res.json(data);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
