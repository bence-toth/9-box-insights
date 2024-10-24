/* eslint-disable sonarjs/no-duplicate-string */

export interface EmployeeData {
  name: string;
  team: string;
  jobLevel: number; // e.g. 1-5
  gender: number; // 1 for men, 0 for anybody else
  ethnicity: number; // 1 for white, 0 for anybody else
  box?: number;
}

const employeesData: EmployeeData[] = [
  {
    name: "Daenerys Targaryen",
    jobLevel: 5,
    gender: 0,
    ethnicity: 1,
    team: "House Targaryen",
  },
  {
    name: "Viserys Targaryen",
    jobLevel: 1,
    gender: 1,
    ethnicity: 1,
    team: "House Targaryen",
  },
  {
    name: "Ned Stark",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Stark",
  },
  {
    name: "Jon Snow",
    jobLevel: 5,
    gender: 1,
    ethnicity: 0,
    team: "Night's Watch",
  },
  {
    name: "Arya Stark",
    jobLevel: 5,
    gender: 0,
    ethnicity: 1,
    team: "House Stark",
  },
  {
    name: "Sansa Stark",
    jobLevel: 4,
    gender: 0,
    ethnicity: 1,
    team: "House Stark",
  },
  {
    name: "Bran Stark",
    jobLevel: 4,
    gender: 1,
    ethnicity: 1,
    team: "House Stark",
  },
  {
    name: "Catelyn Stark",
    jobLevel: 3,
    gender: 0,
    ethnicity: 1,
    team: "House Stark",
  },
  {
    name: "Robb Stark",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Stark",
  },
  {
    name: "Tyrion Lannister",
    jobLevel: 5,
    gender: 1,
    ethnicity: 1,
    team: "House Lannister",
  },
  {
    name: "Cersei Lannister",
    jobLevel: 5,
    gender: 0,
    ethnicity: 1,
    team: "House Lannister",
  },
  {
    name: "Jaime Lannister",
    jobLevel: 4,
    gender: 1,
    ethnicity: 1,
    team: "House Lannister",
  },
  {
    name: "Tywin Lannister",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Lannister",
  },
  {
    name: "Joffrey Baratheon",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Baratheon",
  },
  {
    name: "Stannis Baratheon",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Baratheon",
  },
  {
    name: "Renly Baratheon",
    jobLevel: 2,
    gender: 1,
    ethnicity: 1,
    team: "House Baratheon",
  },
  {
    name: "Margaery Tyrell",
    jobLevel: 3,
    gender: 0,
    ethnicity: 1,
    team: "House Tyrell",
  },
  {
    name: "Olenna Tyrell",
    jobLevel: 3,
    gender: 0,
    ethnicity: 1,
    team: "House Tyrell",
  },
  {
    name: "Samwell Tarly",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "Night's Watch",
  },
  {
    name: "Theon Greyjoy",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Greyjoy",
  },
  {
    name: "Yara Greyjoy",
    jobLevel: 2,
    gender: 0,
    ethnicity: 1,
    team: "House Greyjoy",
  },
  {
    name: "Varys",
    jobLevel: 3,
    gender: 1,
    ethnicity: 0,
    team: "King's Landing",
  },
  {
    name: "Petyr Baelish",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "King's Landing",
  },
  {
    name: "Sandor Clegane",
    jobLevel: 3,
    gender: 1,
    ethnicity: 1,
    team: "House Clegane",
  },
  {
    name: "Gregor Clegane",
    jobLevel: 2,
    gender: 1,
    ethnicity: 1,
    team: "House Clegane",
  },
];

export default employeesData;
