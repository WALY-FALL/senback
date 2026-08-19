import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    serie: {
      type: String,
      required: false,
      trim: true, // supprime les espaces inutiles
    },
    niveau: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    profId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prof", // référence vers le modèle Prof
      required: true, // chaque classe appartient à un prof
    },
  },
  { timestamps: true }
);

const Classe = mongoose.model("Classe", classSchema);
export default Classe;