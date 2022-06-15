import {
  NewPatient,
  Gender,
  Entry,
  HealthCheckRating,
  NewEntry,
  Discharge,
  SickLeave,
} from "./types";

import diagnosesService from "./services/diagnoses";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const isNumber = (num: unknown): num is number => {
  return typeof num === "number";
};

export const parseString = (str: unknown, errName = "str"): string => {
  if (str && isString(str)) {
    return str;
  }
  throw new Error(`invalid ${errName}`);
};

const parseName = (str: unknown): string => {
  if (!str || !isString(str)) {
    throw new Error("invalid name");
  }
  return str;
};

const parseSsn = (ssn: unknown): string => {
  if (ssn && isString(ssn)) {
    return ssn;
  }
  throw new Error("invalid ssn");
};
const parseOccupation = (occupation: unknown): string => {
  if (occupation && isString(occupation)) {
    return occupation;
  }
  throw new Error("invalid occupation");
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (gender: any): gender is Gender => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  return Object.values(Gender).includes(gender);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("invalid params");
  }
  return gender;
};
const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};
const parseDate = (date: unknown): string => {
  if (date && isString(date) && isDate(date)) {
    return date;
  }
  throw new Error("invalid date");
};
const isDischarge = (obj: unknown): obj is Discharge => {
  const discharge = obj as Discharge;
  return discharge && isDate(discharge.date) && isString(discharge.criteria);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating !== undefined && isNumber(rating) && HealthCheckRating[rating]) {
    return rating;
  }
  throw new Error("invalid healthCheckRating");
};

const parseDischarge = (discharge: unknown): Discharge => {
  if (isDischarge(discharge)) {
    return discharge;
  }
  throw new Error("invalid discharge");
};

const isDiagnosisCodes = (code: unknown): code is string[] => {
  if (Array.isArray(code)) {
    for (let i = 0; i < code.length; ++i) {
      const str = parseString(code[i], "code");
      if (!diagnosesService.isValidCode(str)) {
        throw new Error(`invalid code: ${str}`);
      }
    }
    return true;
  }
  return false;
};

const tryParseDiagnosisCodes = (code: unknown): string[] | undefined => {
  if (isDiagnosisCodes(code)) {
    return code;
  }
  return undefined;
};

const tryParseSickLeave = (obj: unknown): SickLeave | undefined => {
  try {
    const sickLeave = obj as SickLeave;
    if (sickLeave) {
      const startDate = parseDate(sickLeave.startDate);
      const endDate = parseDate(sickLeave.endDate);
      return {
        startDate,
        endDate,
      };
    }
  // eslint-disable-next-line no-empty
  } catch {
  }
  return undefined;
};

type EntryFields = {
  type: unknown;
  description: unknown;
  date: unknown;
  specialist: unknown;
  diagnosisCodes: unknown;
  healthCheckRating: unknown;
  discharge: unknown;
  employerName: unknown;
  sickLeave: unknown;
};

export const toNewEntry = ({
  type,
  description,
  date,
  specialist,
  diagnosisCodes,
  healthCheckRating,
  discharge,
  employerName,
  sickLeave,
}: EntryFields): NewEntry => {
  const ptype = parseString(type, "type");
  const pdescription = parseString(description, "description");
  const pdate = parseDate(date);
  const pspecialist = parseString(specialist, "specialist");
  const pdiagnosisCodes = tryParseDiagnosisCodes(diagnosisCodes);
  const psickLeave = tryParseSickLeave(sickLeave);

  switch (ptype) {
    case "HealthCheck":
      const phealthCheckRating = parseHealthCheckRating(healthCheckRating);
      return {
        type: ptype,
        description: pdescription,
        date: pdate,
        specialist: pspecialist,
        diagnosisCodes: pdiagnosisCodes,
        healthCheckRating: phealthCheckRating,
      };
    case "Hospital":
      const pdischarge = parseDischarge(discharge);
      return {
        type: ptype,
        description: pdescription,
        date: pdate,
        specialist: pspecialist,
        diagnosisCodes: pdiagnosisCodes,
        discharge: pdischarge,
      };
    case "OccupationalHealthcare":
      const pemployerName = parseString(employerName, "employerName");
      return {
        type: ptype,
        description: pdescription,
        date: pdate,
        specialist: pspecialist,
        diagnosisCodes: pdiagnosisCodes,
        employerName: pemployerName,
        sickLeave: psickLeave,
      };
    default:
      throw new Error(`Unknown type '${type}'`);
  }
};

type PatientFields = {
  name: unknown;
  ssn: unknown;
  dateOfBirth: unknown;
  gender: unknown;
  occupation: unknown;
};

export const toNewPatient = ({
  name,
  ssn,
  dateOfBirth,
  gender,
  occupation,
}: PatientFields): NewPatient => {
  const entries: Entry[] = [];
  return {
    name: parseName(name),
    ssn: parseSsn(ssn),
    dateOfBirth: parseDate(dateOfBirth),
    gender: parseGender(gender),
    occupation: parseOccupation(occupation),
    entries,
  };
};
