import cors from "cors";

const allowedOrigins = [
 // "http://localhost:3000",
  "https://senecolevirtuelle.com",
  "https://www.senecolevirtuelle.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Autoriser les requêtes sans origin
    // (Postman, certaines requêtes serveur, etc.)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(
      new Error(`CORS : origine non autorisée : ${origin}`)
    );
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
};

export default cors(corsOptions);