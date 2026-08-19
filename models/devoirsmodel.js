import mongoose from "mongoose";

const devoirsSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  contenu: {
    type: String, // ça peut être du texte ou un lien
    required: true,
  },
  datePublication: {
    type: Date,
    default: Date.now,
  },
  profId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Prof",
    required: true,
  },
  classeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Classe",
    required: true,
  },
  fichiers: [
    {
      nom: String,
      url: String,
    },
  ],
});

const Devoirs = mongoose.model("Devoirs", devoirsSchema);

export default Devoirs;
