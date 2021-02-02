import { expect } from "chai";
import UserService from "../../src/services/UserService";
import { testMentor } from "../data";
import { IMentor } from "../../src/models/Mentors";
import { mongoose } from "@typegoose/typegoose";

describe("🙋‍ User Service", () => {
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

  describe("::findMentor()", () => {
    it("finds a mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      if (mentor._id) {
        UserService.findMentor(mentor._id).then((resp) => {
          expect(resp?._id).to.deep.equal(mentor._id);
        });
      }
    });

    it("fails nicely", async () => {
      UserService.findMentor(mongoose.Types.ObjectId()).then((resp) => {
        expect(resp).to.be.equal(null);
      });
    });
  });
});
