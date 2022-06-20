import express from "express";
import diagnoseService from "../services/diagnoses";

const router = express.Router();

router.get("/", (_req, res) => {
  const diagnoses = diagnoseService.getAll();
  res.json(diagnoses);
});


export default router;