import express from "express";

import {startLive, getLiveClasse, stopLive} from "../controller/liveCoursController.js";

import {protect} from "../middlewares/authMiddleware.js";


const router = express.Router();


// Professeur démarre un direct
router.post( "/start", protect, startLive );


// Récupérer le direct d'une classe
router.get( "/classe/:classeId", protect, getLiveClasse );


// Professeur arrête le direct
router.put( "/stop/:id", protect, stopLive);



export default router;