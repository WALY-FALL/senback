import mongoose from "mongoose";

const liveCoursSchema = new mongoose.Schema(
  {
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

    titre: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    statut: {
      type: String,
      enum: ["en_attente", "en_cours", "termine"],
      default: "en_attente",
    },

    dateDebut: {
      type: Date,
      default: Date.now,
    },

    dateFin: {
      type: Date,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Eleve",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 🔥 export ES Module
const LiveCours = mongoose.model("LiveCours", liveCoursSchema);
export default LiveCours;