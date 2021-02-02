import { expect } from "chai";
import UserService from "../../src/services/UserService";
import { testMentor, testParent } from "../data";
import { IMentor } from "../../src/models/Mentors";
import { IParent } from "../../src/models/Parents";
import { mongoose } from "@typegoose/typegoose";

describe("🙋‍ User Service", () => {
  describe("::createMentor()", () => {
    it("creates a mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(mentor[key]).to.be.deep.equal(testMentor[key]);
      });
      // Cleanup
      if (mentor._id) {
        await UserService.deleteMentor(mentor._id);
      }
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
        const resp = await UserService.findMentor(mentor._id);
        expect(resp?._id).to.deep.equal(mentor._id);
        await UserService.deleteMentor(mentor._id);
      }
    });

    it("fails nicely", async () => {
      UserService.findMentor(mongoose.Types.ObjectId()).then((resp) => {
        expect(resp).to.be.equal(null);
      });
    });
  });

  describe("::createParent()", () => {
    it("creates a parent", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      Object.keys(testParent).forEach((key) => {
        expect(parent[key]).to.be.deep.equal(testParent[key]);
      });
      if (parent._id) {
        UserService.deleteParent(parent._id);
      }
    });
  });

  describe("::deleteParent()", () => {
    it("deletes a parent", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      if (parent._id) {
        const ok = await UserService.deleteParent(parent._id);
        expect(ok).to.be.true;
      }
    });
  });

  describe("::findParent()", () => {
    it("finds a parent", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      if (parent._id) {
        const resp = await UserService.findParent(parent._id);
        expect(resp?._id).to.deep.equal(parent._id);
        await UserService.deleteParent(parent._id);
      }
    });

    it("fails nicely", async () => {
      UserService.findParent(mongoose.Types.ObjectId()).then((resp) => {
        expect(resp).to.be.equal(null);
      });
    });
  });
});
