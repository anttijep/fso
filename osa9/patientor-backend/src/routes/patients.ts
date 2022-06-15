import express from "express";
import patientService from "../services/patient";
import { parseString, toNewEntry, toNewPatient } from "../util";

const router = express.Router();

router.get("/", (_req, res) => {
  const patients = patientService.getAll();
  res.json(patients);
});

router.post("/", (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const newPat = toNewPatient(req.body);
    const ret = patientService.addPatient(newPat);
    return res.status(201).json(ret);
  } catch (ex) {
    let error = "Unknown error";
    if (ex instanceof Error) {
      error = ex.message;
    }
    return res.status(400).json({ error });
  }
});

router.get("/:id", (req, res) => {
  try {
    const id = parseString(req.params.id, "id");
    const patient = patientService.getPatient(id);
    return res.json(patient);
  } catch (ex) {
    let error = "Unknown error";
    if (ex instanceof Error) {
      error = ex.message;
    }
    return res.status(400).json({ error });
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const id = parseString(req.params.id, "id");
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const entry = toNewEntry(req.body);
    const retval = patientService.addEntry(id, entry);
    return res.status(201).json(retval);
  }
  catch (ex) {
    let error = "Unknown error";
    if (ex instanceof Error) {
      error = ex.message;
    }
    return res.status(400).json({ error });
  }
});

export default router;
