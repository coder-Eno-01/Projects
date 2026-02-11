import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";

const REQUIRED_ENV_VARS = [
  "PORT",
  "GOOGLE_GEOCODING_API_KEY",
  "GOOGLE_WEATHER_API_KEY"
];

for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`);
    process.exit(1);
  }
}

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`✅ Weather backend running on port ${PORT}`);
});
