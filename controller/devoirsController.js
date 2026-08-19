import Devoirs from "../models/devoirsmodel.js";
import Prof from "../models/profmodel.js";

// Ajouter un devoirs
export const ajouterDevoirs = async (req, res) => {


  try {
    const { titre, description, contenu, classeId, profId } = req.body;

    //const fichiers = req.files?.map(f => f.path); // URL Cloudinary !!!
    const fichiers = req.files?.map(f => ({
      //url: f.path,        // l’URL Cloudinary
      url: f.secure_url || f.path, // priorite à secure_url
      nom: f.originalname // nom du fichier
    }));
    
    console.log(req.files);
    console.log("📁 FILE UPLOADED:", req.files);
    const devoirs = await Devoirs.create({
      titre,
      description,
      contenu,
      classeId,
      profId,
      fichiers,
    });

    res.status(201).json(devoirs);

  } catch (err) {
    console.error("Erreur Cloudinary :", err);
    res.status(500).json({ message: "Erreur serveur lors de la création du cours" });
  }
};

// Récupérer tous les devoirs d'un professeur
export const getDevoirsParProfesseur = async (req, res) => {
  try {
    const profId = req.prof.id; // récupéré depuis le token
    const devoirs = await Devoirs.find({ profId: profId });
    res.json(devoirs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDevoirsParClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    console.log("📥 [getCoursParClasse] Classe ID reçu :", classeId);

    // Vérifie si la classeId est bien reçue
    if (!classeId) {
      console.log("⚠️ Aucun classeId reçu !");
      return res.status(400).json({ message: "Classe ID manquant" });
    }

    // Récupération des devoirs
    const devoirs = await Devoirs.find({ classeId });
    console.log("🔍 Devoirs trouvés :", devoirs.length);

    // Vérifie les données des devoirs
    if (devoirs.length > 0) {
      console.log("📄 Exemple du premier devoir :", devoirs[0]);
    }

    // Peuplement
    const devoirsPopulated = await Devoirs.find({ classeId }).populate("profId", "nom prenom");
    console.log("✅ Après populate :", devoirsPopulated.length);

    res.status(200).json(devoirsPopulated);
  } catch (error) {
    console.error("❌ Erreur backend complète :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des devoirs de la classe",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const supprimerDevoirs = async (req, res) => {
  try {
    const devoirsId = req.params.id;
    const profId = req.prof.id; // depuis le token

    const devoirs = await Devoirs.findById(devoirsId);

    if (!devoirs) {
      return res.status(404).json({ message: "Devoirs introuvable" });
    }

    // 🔐 Sécurité : seul le prof propriétaire peut supprimer
    if (devoirs.profId.toString() !== profId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    await devoirs.deleteOne();

    res.status(200).json({ message: "Devoirs supprimé avec succès", devoirsId });
  } catch (err) {
    console.error("❌ Suppression devoirs :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
