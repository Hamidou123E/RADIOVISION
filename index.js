const express = require("express");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express();
app.use(cors());

cloudinary.config({
  cloud_name: "dywtqopvn",
  api_key: "653954857412156",
  api_secret: "_pKK95qCs4VyrVhIeqYTt0Kj4FU",
});

// Formate le resource Cloudinary, en cherchant context.custom.titre/artiste 
function formatResource(resource) {
  const context = (resource.context && resource.context.custom) || {};
  return {
    titre: context.titre || resource.public_id,
    artiste: context.artiste || "Inconnu",
    url: resource.secure_url,
  };
}

app.get("/media", async (req, res) => {
  try {
    const audioResponse = await cloudinary.search
      .expression("resource_type:video AND (format:mp3 OR format:wav)")
      .max_results(50)
      .with_field('context')      // <-- C'est essentiel ! 
      .execute();

    const videoResponse = await cloudinary.search
      .expression("resource_type:video AND (format:mp4 OR format:mov)")
      .max_results(50)
      .with_field('context')      // <-- Ici aussi !
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
