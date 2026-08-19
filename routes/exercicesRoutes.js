import express from "express";
import multer from "multer";
import { ajouterExercices, getExercicesParProfesseur, getExercicesParClasse, supprimerExercices } from "../controller/exercicesController.js";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { protect } from "../middlewares/authMiddleware.js";


const router = express.Router();


// Storage local
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// Route upload exercices

router.post("/", upload.array("fichiers", 5), ajouterExercices);


// Routes

// Ajouter un exercice avec fichiers
// Ajouter un exercice (sécurisé)
router.post("/", verifyToken, upload.array("fichiers", 10), ajouterExercices);

// Récupérer tous les cours d'un professeur
router.get("/prof", verifyToken ,getExercicesParProfesseur);

// Récupérer tous les cours d'une classe
router.get("/classe/:classeId", verifyToken, getExercicesParClasse);

router.get("/test", (req, res) => {
  res.send("Route exercice OK");
});

// Supprimer un exercice (sécurisé)
router.delete("/:id", protect, supprimerExercices);

export default router;
