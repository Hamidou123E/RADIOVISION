const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dywtqopvn',
  api_key: '653954857412156',
  api_secret: '_pKK95qCs4VyrVhIeqYTt0Kj4FU',
});

// Filtre tous les médias de type vidéo (y compris audios et vidéos)
// Trie du + récent au + ancien
cloudinary.search
  .expression('resource_type:video')
  .with_field('context')
  .sort_by('created_at','desc')
  .max_results(100) // adapte ce nombre à tes besoins
  .execute()
  .then(result => {
    result.resources.forEach(res => {
      const context = (res.context && res.context.custom) || {};
      console.log({
        artiste: context.artiste || "Inconnu",
        titre: context.titre || res.public_id,
        url: res.secure_url,
      });
    });
  })
  .catch(err => {
    console.error("Erreur Cloudinary:", err);
  });
