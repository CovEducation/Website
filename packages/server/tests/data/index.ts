import { v4 as uuid } from "uuid";
import NotificationPreference from "../../src/models/NotificationPreference";
import { IMentor } from "../../src/models/Mentors";

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
  gradeLevels: [],
  timezone: "EST",
};
