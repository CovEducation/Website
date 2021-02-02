import { v4 as uuid } from "uuid";
import NotificationPreference from "../../src/models/NotificationPreference";
import { IMentor } from "../../src/models/Mentors";
import { IStudent } from "../../src/models/Students";
import { IParent } from "../../src/models/Parents";

export const testMentor: IMentor = {
  firebaseUID: uuid(),
  name: "Ben Bitdiddle",
  email: "testUser@email.com",
  phone: "18002920011",
  pronouns: "He/Him",
  avatar: "www.imgur.com/testImage.jpg",
  bio: "Hello I'm a test user",
  major: "Testing",
  notificationPreference: NotificationPreference.EMAIL,
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
  notificationPreference: NotificationPreference.EMAIL,
  timezone: "EST",
  students: [testStudent],
};
