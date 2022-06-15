import diagnoses from "../../data/diagnoses";
import { Diagnosis } from "../types";


const getAll = (): Diagnosis[] => {
  return diagnoses;
};

const isValidCode = (code: string): boolean  => {
  return Boolean(diagnoses.find(d => d.code === code));
};

export default {
  getAll,
  isValidCode,
};
