import { expect } from "chai";
import { v4 as uuid } from "uuid";
import { IMentor } from "../../src/models/Mentors";
import NotificationPreference from "../../src/models/NotificationPreference";
import UserService from "../../src/services/UserService";

const testMentor: IMentor = {
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

describe("User Service", () => {
  describe("::createMentor()", () => {
    it("creates a mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(mentor[key]).to.be.deep.equal(testMentor[key]);
      });
    });
  });

  describe("::deleteMentor()", () => {
    it("deletes a mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      if (mentor._id) {
        const ok = await UserService.deleteMentor(mentor._id);
        expect(ok).to.be.true;
      }
    });
  });
});
