import { v4 as uuid } from "uuid";
import CommunicationPreference from "../../src/models/CommunicationPreference";
import { IMentor } from "../../src/models/Mentors";
import { IStudent } from "../../src/models/Students";
import { IParent } from "../../src/models/Parents";

export const testMentor: IMentor = {
  firebaseUID: uuid(),
  name: "Ben Bitdiddle",
  email: "jack@mit.edu",
  phone: "8002016779",
  pronouns: "He/Him",
  avatar: "www.imgur.com/testImage.jpg",
  bio: "Hello I'm a test user",
  major: "Testing",
  communicationPreference: CommunicationPreference.EMAIL,
  gradeLevels: ["8"],
  timezone: "EST",
};

export const testStudent: IStudent = {
  name: "Pork Bun",
  email: "pork@bun.com",
  gradeLevel: "5",
  subjects: ["Algebra", "English"],
};

export const testParent: IParent = {
  firebaseUID: uuid(),
  name: "Alyssa P Hacker",
  email: "alyssa@hacker.com",
  phone: "1800839387",
  pronouns: "She/Her",
  avatar: "www.imgur.com/testImage.jpg",
  communicationPreference: CommunicationPreference.EMAIL,
  timezone: "EST",
  students: [testStudent],
};
