import Exercices from "../models/exercicesmodel.js";
import Prof from "../models/profmodel.js";

// Ajouter un exercice
export const ajouterExercices = async (req, res) => {


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
    const exercices = await Exercices.create({
      titre,
      description,
      contenu,
      classeId,
      profId,
      fichiers,
    });

    res.status(201).json(exercices);

  } catch (err) {
    console.error("Erreur Cloudinary :", err);
    res.status(500).json({ message: "Erreur serveur lors de la création de l'exercice" });
  }
};

// Récupérer tous les exercices d'un professeur
export const getExercicesParProfesseur = async (req, res) => {
  try {
    const profId = req.prof.id; // récupéré depuis le token
    const exercices = await Exercices.find({ profId: profId });
    res.json(exercices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExercicesParClasse = async (req, res) => {
  try {
    const { classeId } = req.params;
    console.log("📥 [getExercicesParClasse] Classe ID reçu :", classeId);

    // Vérifie si la classeId est bien reçue
    if (!classeId) {
      console.log("⚠️ Aucun classeId reçu !");
      return res.status(400).json({ message: "Classe ID manquant" });
    }

    // Récupération des cours
    const exercices = await Exercices.find({ classeId });
    console.log("🔍 Exercices trouvés :", exercices.length);

    // Vérifie les données des cours
    if (exercices.length > 0) {
      console.log("📄 Exemple du premier exercice :", exercices[0]);
    }

    // Peuplement
    const exercicesPopulated = await Exercices.find({ classeId }).populate("profId", "nom prenom");
    console.log("✅ Après populate :", exercicesPopulated.length);

    res.status(200).json(exercicesPopulated);
  } catch (error) {
    console.error("❌ Erreur backend complète :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des exercices de la classe",
      error: error.message,
      stack: error.stack,
    });
  }
};

export const supprimerExercices = async (req, res) => {
  try {
    const exercicesId = req.params.id;
    const profId = req.prof.id; // depuis le token

    const exercices = await Exercices.findById(exercicesId);

    if (!exercices) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    // 🔐 Sécurité : seul le prof propriétaire peut supprimer
    if (exercices.profId.toString() !== profId) {
      return res.status(403).json({ message: "Action non autorisée" });
    }

    await exercices.deleteOne();

    res.status(200).json({ message: "Exercice supprimé avec succès", coursId });
  } catch (err) {
    console.error("❌ Suppression exercice :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
