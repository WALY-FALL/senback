
import jwt from "jsonwebtoken";
import Prof from "../models/profmodel.js";

// ✅ Middleware complet pour routes professeurs
 export const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Pas de token fourni" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Recherche du professeur authentifié
    const prof = await Prof.findById(decoded.profId).select("-password");

    if (!prof) {
      return res.status(404).json({ message: "Professeur introuvable" });
    }

    req.prof = prof;
    next();
  } catch (error) {
    console.error("Erreur protect :", error);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};

// ✅ Middleware plus léger pour routes élèves ou autres
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // On peut y stocker profId ou eleveId selon le token
    next();
  } catch (error) {
    console.error("Erreur verifyToken :", error);
    res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
