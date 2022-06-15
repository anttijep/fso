import patients from "../../data/patients";
import { PublicPatient, Patient, NewPatient, NewEntry, Entry } from "../types";
import { v1 } from "uuid";

const patientToPublic = ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}: Patient): PublicPatient => {
  return {
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  };
};

const getAll = (): PublicPatient[] => patients.map((p) => patientToPublic(p));

const getPatient = (id: string): Patient => {
  const patient = patients.find((p) => p.id === id);
  if (patient) {
    return patient;
  }
  throw new Error("not found");
};

const addPatient = (patient: NewPatient): PublicPatient => {
  const newpat = patient as Patient;
  newpat.id = v1();
  patients.push(newpat);
  return patientToPublic(newpat);
};

const addEntry = (id: string, entry: NewEntry): Entry => {
  const patient = patients.find(p => p.id === id);
  if (!patient) {
    throw new Error("invalid id");
  }
  const retval = {...entry, id: v1()};
  patient.entries.push(retval);
  return retval;
};

export default {
  getAll,
  addPatient,
  getPatient,
  addEntry
};
