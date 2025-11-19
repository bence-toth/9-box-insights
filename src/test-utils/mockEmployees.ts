// Mock employee data for testing
// Centralized constants to avoid duplication across test files

export const ARYA_STARK = "Arya Stark";
export const NED_STARK = "Ned Stark";
export const SANSA_STARK = "Sansa Stark";
export const ROBB_STARK = "Robb Stark";
export const JON_SNOW = "Jon Snow";
export const TYRION_LANNISTER = "Tyrion Lannister";
export const DAENERYS_TARGARYEN = "Daenerys Targaryen";
export const HOUSE_STARK = "House Stark";
export const NIGHTS_WATCH = "Night's Watch";
export const HOUSE_LANNISTER = "House Lannister";
export const HOUSE_TARGARYEN = "House Targaryen";

export const mockEmployeesData = [
  {
    name: ARYA_STARK,
    team: HOUSE_STARK,
    jobLevel: 5,
    gender: 0,
    ethnicity: 1,
  },
  {
    name: JON_SNOW,
    team: NIGHTS_WATCH,
    jobLevel: 5,
    gender: 1,
    ethnicity: 0,
  },
  {
    name: TYRION_LANNISTER,
    team: HOUSE_LANNISTER,
    jobLevel: 5,
    gender: 1,
    ethnicity: 1,
  },
];
