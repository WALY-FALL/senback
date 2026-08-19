import express from "express";
import multer from "multer";
import { ajouterDevoirs, getDevoirsParProfesseur, getDevoirsParClasse, supprimerDevoirs } from "../controller/devoirsController.js";
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

// Route upload devoirs

router.post("/", upload.array("fichiers", 5), ajouterDevoirs);


// Routes

// Ajouter un devoir avec fichiers
// Ajouter un devoir (sécurisé)
router.post("/", verifyToken, upload.array("fichiers", 10), ajouterDevoirs);

// Récupérer tous les devoirs d'un professeur
router.get("/prof", verifyToken ,getDevoirsParProfesseur);

// Récupérer tous les devoirs d'une classe
router.get("/classe/:classeId", verifyToken, getDevoirsParClasse);

router.get("/test", (req, res) => {
  res.send("Route devoirs OK");
});

// Supprimer un devoirs (sécurisé)
router.delete("/:id", protect, supprimerDevoirs);

export default router;
