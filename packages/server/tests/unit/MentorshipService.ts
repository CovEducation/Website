import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import chaiSubset from "chai-subset";
import { IMentor } from "../../src/models/Mentors";
import { MentorshipState } from "../../src/models/Mentorships";
import { IParent } from "../../src/models/Parents";
import { ISession } from "../../src/models/Sessions";
import { IStudent } from "../../src/models/Students";
import MentorshipService, {
  MentorshipRequest,
} from "../../src/services/MentorshipService";
import UserService from "../../src/services/UserService";
import { testMentor, testParent } from "../data";
import { connect, clearDatabase, closeDatabase } from "../utils";

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

const createUsers = async (): Promise<[IParent, IMentor, IStudent]> => {
  const parent = await UserService.createParent(testParent);
  const mentor = await UserService.createMentor(testMentor);
  const student = parent.students[0];
  return [parent, mentor, student];
};

/**
 * Testing strategy
 *  sendRequest():
 *    - Ensure that all 4 combinations of communication preferences between mentors and parents are respected.
 *    - Ensure that a parent cannot request mentorship for a student that is already mentored
 *    - Ensure that empty messages are rejected.
 *
 */
describe("📚 Mentorship Service", () => {
  describe("::sendRequest()", () => {
    it("creates a mentorship document", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      expect(mentorship._id).to.exist;
      expect(mentorship.state).to.be.equal(MentorshipState.PENDING);
      expect(mentorship.sessions).to.have.length.gte(0);
      expect(mentorship.startDate).to.be.undefined;
    });

    it("rejects empty messages", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "",
        parent,
        student,
        mentor,
      };
      await expect(MentorshipService.sendRequest(request)).to.eventually.be
        .rejected;
    });

    it("prevents double requests", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "The quick brown fox jumped over the lazy dog",
        parent,
        student,
        mentor,
      };
      await MentorshipService.sendRequest(request);
      await expect(MentorshipService.sendRequest(request)).to.eventually.be
        .rejected;
    });

    it("prevents request to ongoing mentorship", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor({
        ...testMentor,
        email: "jack@stata.mit",
      });
      const request: MentorshipRequest = {
        message: "The quick brown fox jumped over the lazy dog",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      const otherRequest: MentorshipRequest = {
        message: "I want two mentors!",
        mentor: otherMentor,
        parent,
        student,
      };
      await expect(MentorshipService.sendRequest(otherRequest)).to.eventually.be
        .rejected;
    });
  });

  describe("::acceptRequest()", () => {
    it("can accept a request", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      if (mentor._id === undefined) {
        throw new Error(`Failed to create valid test mentor`);
      }
      const mentorships = await MentorshipService.getCurrentMentorships(
        mentor._id
      );
      expect(mentorships.length).to.be.equal(1);
      const acceptedMentorship = mentorships[0];
      expect(acceptedMentorship.state).to.be.equal(MentorshipState.ACTIVE);
      expect(acceptedMentorship.startDate).to.exist;
    });

    it("blocks accepting a non-pending request", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      await expect(MentorshipService.acceptRequest(mentorship)).to.eventually.be
        .rejected;
      await expect(MentorshipService.acceptRequest(mentorship)).to.eventually.be
        .rejected;
      await expect(MentorshipService.acceptRequest(mentorship)).to.eventually.be
        .rejected;
    });

    it("blocks double-mentoring a student", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor({
        ...testMentor,
        email: "jack@stata.mit",
      });
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const otherRequest: MentorshipRequest = {
        message: "Two mentorships please",
        mentor: otherMentor,
        parent,
        student,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      const otherMentorship = await MentorshipService.sendRequest(otherRequest);
      await MentorshipService.acceptRequest(mentorship);

      await expect(MentorshipService.acceptRequest(otherMentorship)).to.be
        .rejected;
    });

    it("cannot accept request after student was mentored", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor({
        ...testMentor,
        email: "jack@stata.mit",
      });
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const otherRequest: MentorshipRequest = {
        message: "Two mentorships please",
        mentor: otherMentor,
        parent,
        student,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      const otherMentorship = await MentorshipService.sendRequest(otherRequest);
      await MentorshipService.acceptRequest(mentorship);
      await MentorshipService.archiveMentorship(mentorship);
      await expect(MentorshipService.acceptRequest(otherMentorship)).to.be
        .rejected;
    });

    it("rejects other mentorships", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor({
        ...testMentor,
        email: "jack@stata.mit",
      });
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const otherRequest: MentorshipRequest = {
        message: "Two mentorships please",
        mentor: otherMentor,
        parent,
        student,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.sendRequest(otherRequest);
      await MentorshipService.acceptRequest(mentorship);
      if (student._id === undefined) {
        throw new Error(`Failed to create student test data`);
      }
      const currentMentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const pendingMentorships = currentMentorships.filter(
        (v) => v._id !== mentorship._id && v.state === MentorshipState.PENDING
      );
      expect(pendingMentorships.length).to.be.equal(0);
    });

    it("sets the correct start date", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      const prevTime = new Date();
      await MentorshipService.acceptRequest(mentorship);
      if (mentor._id === undefined) {
        throw new Error(`Failed to create valid test mentor`);
      }
      const mentorships = await MentorshipService.getCurrentMentorships(
        mentor._id
      );
      expect(mentorships.length).to.be.equal(1);
      const acceptedMentorship = mentorships[0];
      expect(acceptedMentorship.state).to.be.equal(MentorshipState.ACTIVE);
      expect(acceptedMentorship.startDate).to.exist;
      if (acceptedMentorship.startDate) {
        const delta = Math.abs(
          new Date().getTime() - acceptedMentorship.startDate.getTime()
        );
        expect(delta).to.be.lte(5 * 1000); // 5 seconds.
        expect(acceptedMentorship.startDate).to.be.gte(prevTime);
      }
    });

    it("blocks invalid calls", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      mentorship._id = undefined;
      expect(() => MentorshipService.acceptRequest(mentorship)).to.throw;
    });
  });

  describe("::addSessionToMentorship()", () => {
    it("adds a session", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data.");
      }
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: 0.5,
      };
      const finalMentorship = await MentorshipService.addSessionToMentorship(
        session,
        mentorships[0]
      );
      expect(finalMentorship.sessions).to.deep.equal([session]);
    });

    it("can add a session from current mentorships", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data.");
      }
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: 0.5,
      };
      await expect(
        MentorshipService.addSessionToMentorship(session, mentorships[0])
      ).to.not.eventually.be.rejected;
      const updatedMentorship = await MentorshipService.getCurrentMentorships(
        student._id
      );
      expect(updatedMentorship.length).to.be.equal(1);
      expect(updatedMentorship[0].sessions).to.be.deep.equal([session]);
    });

    it("does not overwrite previous sessions", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data.");
      }
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: 0.5,
      };
      await MentorshipService.addSessionToMentorship(session, mentorships[0]);
      const otherSession: ISession = {
        durationMinutes: 120,
        date: new Date(),
        rating: 0.87,
      };
      await MentorshipService.addSessionToMentorship(
        otherSession,
        mentorships[0]
      );

      const updatedMentorship = await MentorshipService.getCurrentMentorships(
        student._id
      );
      expect(updatedMentorship.length).to.be.equal(1);
      expect(updatedMentorship[0].sessions.length).to.be.equal(2);
      expect(updatedMentorship[0].sessions).to.be.deep.equal([
        session,
        otherSession,
      ]);
    });

    it("ensures mentorship is active", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data.");
      }
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      await MentorshipService.sendRequest(request);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: 0.5,
      };
      await expect(
        MentorshipService.addSessionToMentorship(session, mentorships[0])
      ).to.eventually.be.rejected;
    });

    it("ensures rating <= 1", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data.");
      }
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      await MentorshipService.sendRequest(request);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: 2,
      };
      expect(() =>
        MentorshipService.addSessionToMentorship(session, mentorships[0])
      ).to.throw;
    });

    it("ensures rating > 0", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data.");
      }
      const request: MentorshipRequest = {
        message: "One mentorship please",
        parent,
        student,
        mentor,
      };
      await MentorshipService.sendRequest(request);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: -0.1,
      };
      expect(() =>
        MentorshipService.addSessionToMentorship(session, mentorships[0])
      ).to.throw;
    });

    it("blocks invalid calls", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      mentorship._id = undefined;
      const session: ISession = {
        durationMinutes: 60,
        date: new Date(),
        rating: 0.1,
      };
      expect(() =>
        MentorshipService.addSessionToMentorship(session, mentorship)
      ).to.throw;
    });
  });

  describe("::rejectRequest()", () => {
    it("rejects a request", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      const updatedMentorship = await MentorshipService.rejectRequest(
        mentorship
      );
      expect(updatedMentorship.state).to.be.equal(MentorshipState.REJECTED);
    });
    it("rejects only pending requests", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      MentorshipService.acceptRequest(mentorship);
      const updatedMentorship = await MentorshipService.rejectRequest(
        mentorship
      );
      expect(updatedMentorship.state).to.be.equal(MentorshipState.REJECTED);
    });

    it("does not affect other pending requests", async () => {
      const [parent, mentor, student] = await createUsers();
      if (student._id === undefined) {
        throw new Error("Failed to create test data");
      }
      const otherMentor = await UserService.createMentor({
        ...testMentor,
        email: "jack@stata.mit",
      });
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const otherRequest: MentorshipRequest = {
        message: "Hi! Can you tutor my daughter?",
        mentor: otherMentor,
        parent,
        student,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.sendRequest(otherRequest);
      MentorshipService.acceptRequest(mentorship);
      const updatedMentorship = await MentorshipService.rejectRequest(
        mentorship
      );
      expect(updatedMentorship.state).to.be.equal(MentorshipState.REJECTED);
      const mentorships = await MentorshipService.getCurrentMentorships(
        student._id
      );
      expect(mentorships.length).to.be.equal(2);

      const rejectedMentorships = mentorships.filter(
        (v) => v.state === MentorshipState.REJECTED
      );
      const pendingMentorships = mentorships.filter(
        (v) => v.state === MentorshipState.PENDING
      );
      expect(rejectedMentorships.length).to.equal(1);
      expect(pendingMentorships.length).to.equal(1);
    });

    it("cannot reject accepted requests", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      MentorshipService.rejectRequest(mentorship);
      await MentorshipService.acceptRequest(mentorship);
      await expect(MentorshipService.rejectRequest(mentorship)).to.eventually.be
        .rejected;
    });

    it("blocks double rejections", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      MentorshipService.rejectRequest(mentorship);
      await MentorshipService.rejectRequest(mentorship);
      expect(MentorshipService.rejectRequest(mentorship)).to.eventually.be
        .rejected;
    });

    it("blocks invalid calls", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      mentorship._id = undefined;
      expect(() => MentorshipService.rejectRequest(mentorship)).to.throw;
    });
  });

  describe("::archiveMentorship()", () => {
    it("archives a mentorship", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      const prevTime = new Date();
      const updatedMentorship = await MentorshipService.archiveMentorship(
        mentorship
      );
      expect(updatedMentorship.state).to.be.equal(MentorshipState.ARCHIVED);
      expect(updatedMentorship.endDate).to.not.be.undefined;
      if (updatedMentorship.startDate) {
        const delta = Math.abs(
          new Date().getTime() - updatedMentorship.startDate.getTime()
        );
        expect(delta).to.be.lte(5 * 1000); // 5 seconds.
        expect(updatedMentorship.endDate).to.be.gte(prevTime);
      }
    });

    it("archives only active mentorships", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await expect(MentorshipService.archiveMentorship(mentorship)).to.be
        .rejected;
    });

    it("allows student to make new requests", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      await MentorshipService.archiveMentorship(mentorship);
      expect(MentorshipService.sendRequest(request)).to.not.be.rejected;
    });

    it("only archives a mentorship once", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      await MentorshipService.archiveMentorship(mentorship);
      await expect(MentorshipService.archiveMentorship(mentorship)).to.be
        .rejected;
    });

    it("has database consistency", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      await MentorshipService.archiveMentorship(mentorship);
      mentorship.state = MentorshipState.ACTIVE;
      await expect(MentorshipService.archiveMentorship(mentorship)).to.be
        .rejected;
    });

    it("blocks invalid calls", async () => {
      const [parent, mentor, student] = await createUsers();
      const request: MentorshipRequest = {
        message: "Hi! Would you be able to tutor my son?",
        parent,
        student,
        mentor,
      };
      const mentorship = await MentorshipService.sendRequest(request);
      await MentorshipService.acceptRequest(mentorship);
      mentorship._id = undefined;
      expect(() => MentorshipService.archiveMentorship(mentorship)).to.throw;
    });
  });
});
