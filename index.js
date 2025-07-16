const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: "dgkrg4kk0",
  api_key: "454854139817129",
  api_secret: "iqf4f8uufAbMd7Crjl6ppmHF80o",
});

// ❗ Ici, on retourne seulement les tags et le lien
function formatResource(resource) {
  return {
    tags: resource.tags || [],
    url: resource.secure_url,
  };
}

app.get("/media", async (req, res) => {
  try {
    const audioResponse = await cloudinary.search
      .expression("resource_type:video AND (format:mp3 OR format:wav)")
      .max_results(50)
      .with_field("context")
      .with_field("tags")
      .execute();

    const videoResponse = await cloudinary.search
      .expression("resource_type:video AND (format:mp4 OR format:mov)")
      .max_results(50)
      .with_field("context")
      .with_field("tags")
      .execute();

    const audio = audioResponse.resources.map(formatResource);
    const video = videoResponse.resources.map(formatResource);

    res.json({ audio, video });
  } catch (error) {
    console.error("Erreur Cloudinary:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API Cloudinary démarrée sur port ${PORT}`);
});
