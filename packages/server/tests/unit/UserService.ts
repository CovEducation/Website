import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import { mongoose } from "@typegoose/typegoose";
import { v4 as uuid } from "uuid";
import { connect, clearDatabase, closeDatabase, setupMocks } from "../utils";
(async () => {
  await setupMocks();
})();
import UserService from "../../src/services/UserService";
import { testMentor, testParent } from "../data";
import { IMentor } from "../../src/models/Mentors";
import { IParent } from "../../src/models/Parents";

chai.use(chaiAsPromised); // Allows us to handle promise rejections.
chai.use(chaiSubset);
const expect = chai.expect;
/**
 * Start a new server & connect to a new in-memory database before running any tests.
 */
before(async function () {
  this.timeout(120000); // 2 mins to download a local MongoDB installation.
  await connect();
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
after(async () => await closeDatabase());

describe("🙋‍ User Service", () => {
  describe("::createMentor()", () => {
    it("creates a mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(mentor[key]).to.be.deep.equal(testMentor[key]);
      });
    });

    it("prevents duplicates", async () => {
      await UserService.createMentor(testMentor);
      await expect(UserService.createMentor(testMentor)).to.eventually.be
        .rejected;
    });

    it("syncs with algolia", async () => {});
  });
  describe("::updateMentor()", () => {
    it("can update existing mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(mentor[key]).to.be.deep.equal(testMentor[key]);
      });
      if (mentor._id === undefined) {
        expect(mentor._id).to.not.be.undefined;
        return;
      }
      const updatedMentor: IMentor = {
        ...testMentor,
        college: "Stanford",
        name: "Alyssa P Hacker",
      };
      const ok = await UserService.updateMentor(mentor._id, updatedMentor);
      expect(ok).to.be.true;
    });

    it("reflects the changes automatically", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(mentor[key]).to.be.deep.equal(testMentor[key]);
      });
      if (mentor._id === undefined) {
        expect(mentor._id).to.not.be.undefined;
        return;
      }
      const updatedMentor: IMentor = {
        ...testMentor,
        college: "Stanford",
        name: "Alyssa P Hacker",
      };
      const ok = await UserService.updateMentor(mentor._id, updatedMentor);
      expect(ok).to.be.true;
      const doc = await UserService.findMentor(mentor._id);
      expect(doc.name).to.be.equal(updatedMentor.name);
      expect(doc._id?.equals(mentor._id)).to.be.true;
      expect(doc.firebaseUID).to.be.equal(mentor.firebaseUID);
      expect(doc.college).to.be.equal(updatedMentor.college);
    });

    it("blocks breaking updates", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(mentor[key]).to.be.deep.equal(testMentor[key]);
      });
      if (mentor._id === undefined) {
        expect(mentor._id).to.not.be.undefined;
        return;
      }
      const updatedMentor: IMentor = {
        ...testMentor,
        firebaseUID: uuid(),
        _id: mongoose.Types.ObjectId(),
      };
      const ok = await UserService.updateMentor(mentor._id, updatedMentor);
      expect(ok).to.be.true;
      const doc = await UserService.findMentor(mentor._id);
      expect(doc._id?.equals(mentor._id)).to.be.true;
      expect(doc.firebaseUID).to.be.equal(mentor.firebaseUID);
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

    it("handles non-existent mentors", async () => {
      const ok = await UserService.deleteMentor(mongoose.Types.ObjectId());
      expect(ok).to.be.false;
    });

    it("syncs with algolia", async () => {});
  });

  describe("::findMentor()", () => {
    it("finds a mentor", async () => {
      const mentor: IMentor = await UserService.createMentor(testMentor);
      expect(mentor._id).to.exist;
      if (mentor._id) {
        const resp = await UserService.findMentor(mentor._id);
        expect(resp?._id).to.deep.equal(mentor._id);
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
      expect(parent).to.containSubset(testParent);
    });

    it("prevents duplicates", async () => {
      const parent = await UserService.createParent(testParent);
      if (parent._id) {
        await expect(UserService.createParent(testParent)).to.eventually.be
          .rejected;
      }
    });

    it("Uses the correct enums", async () => {
      const parent = await UserService.createParent(testParent);
      expect(parent.communicationPreference).to.be.a("string");
    });

    it("Creates a student subdocument", async () => {
      const parent = await UserService.createParent(testParent);
      expect(parent.students.length).to.be.gt(0);
      expect(parent.students[0]._id).to.exist;
    });

    it("Have unique identifiers", async () => {
      const parent = await UserService.createParent(testParent);
      expect(parent.students.length).to.be.gt(0);
      expect(parent.students[0]._id).to.not.be.equal(parent._id);
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

    it("handles non-existent parents", async () => {
      const ok = await UserService.deleteParent(mongoose.Types.ObjectId());
      expect(ok).to.be.false;
    });
  });

  describe("::updateParent()", () => {
    it("can update existing parent", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(parent[key]).to.be.deep.equal(testParent[key]);
      });
      if (parent._id === undefined) {
        expect(parent._id).to.not.be.undefined;
        return;
      }
      const updatedParent: IParent = {
        ...testParent,
        name: "Alyssa P Hacker",
      };
      const ok = await UserService.updateParent(parent._id, updatedParent);
      expect(ok).to.be.true;
    });

    it("reflects the changes automatically", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(parent[key]).to.be.deep.equal(testParent[key]);
      });
      if (parent._id === undefined) {
        expect(parent._id).to.not.be.undefined;
        return;
      }
      const updatedParent: IParent = {
        ...testParent,
        name: "Alyssa P Hacker",
      };
      const ok = await UserService.updateParent(parent._id, updatedParent);
      expect(ok).to.be.true;
      const doc = await UserService.findParent(parent._id);
      expect(doc.name).to.be.equal(updatedParent.name);
      expect(doc._id?.equals(parent._id)).to.be.true;
      expect(doc.firebaseUID).to.be.equal(parent.firebaseUID);
    });

    it("blocks breaking updates", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      Object.keys(testMentor).forEach((key) => {
        expect(parent[key]).to.be.deep.equal(testParent[key]);
      });
      if (parent._id === undefined) {
        expect(parent._id).to.not.be.undefined;
        return;
      }
      const updatedParent: IParent = {
        ...testParent,
        firebaseUID: uuid(),
        _id: mongoose.Types.ObjectId(),
      };
      const ok = await UserService.updateParent(parent._id, updatedParent);
      expect(ok).to.be.true;
      const doc = await UserService.findParent(parent._id);
      expect(doc.name).to.be.equal(updatedParent.name);
      expect(doc._id?.equals(parent._id)).to.be.true;
      expect(doc.firebaseUID).to.be.equal(parent.firebaseUID);
    });
  });

  describe("::findParent()", () => {
    it("finds a parent", async () => {
      const parent: IParent = await UserService.createParent(testParent);
      expect(parent._id).to.exist;
      if (parent._id) {
        const resp = await UserService.findParent(parent._id);
        expect(resp?._id).to.deep.equal(parent._id);
        expect(resp).to.containSubset(testParent);
      }
    });

    it("fails nicely", async () => {
      UserService.findParent(mongoose.Types.ObjectId()).then((resp) => {
        expect(resp).to.be.equal(null);
      });
    });
  });
});
