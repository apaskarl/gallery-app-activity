require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const folderName = process.env.FOLDER_NAME;

// API Route to fetch images from Cloudinary
app.get("/get-images", async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        params: { expression: `folder:${folderName}`, max_results: 100 },
        headers: {
          Authorization: `Basic ${Buffer.from(
            apiKey + ":" + apiSecret
          ).toString("base64")}`,
        },
      }
    );

    const images = response.data.resources.map((img) => img.secure_url);
    res.json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ error: "Failed to fetch images" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
