import chai, { expect } from "chai";
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
      expect(MentorshipService.sendRequest(request)).to.be.rejected;
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
      expect(MentorshipService.sendRequest(request)).to.be.rejected;
    });

    it("prevents request to ongoing mentorship", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor(testMentor);
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
      expect(MentorshipService.sendRequest(otherRequest)).to.be.rejected;
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
      expect(MentorshipService.acceptRequest(mentorship)).to.be.rejected;
      mentorship.state = MentorshipState.ARCHIVED;
      expect(MentorshipService.acceptRequest(mentorship)).to.be.rejected;
      mentorship.state = MentorshipState.REJECTED;
      expect(MentorshipService.acceptRequest(mentorship)).to.be.rejected;
    });

    it("blocks double-mentoring a student", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor(testMentor);
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

      expect(MentorshipService.acceptRequest(otherMentorship)).to.be.rejected;
    });

    it("can accept after a previous mentor left", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor(testMentor);
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
      expect(MentorshipService.acceptRequest(otherMentorship)).to.not.be
        .rejected;
    });

    it("rejects other mentorships", async () => {
      const [parent, mentor, student] = await createUsers();
      const otherMentor = await UserService.createMentor(testMentor);
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
  });

  describe("::addSession", () => {
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
      expect(MentorshipService.addSessionToMentorship(session, mentorships[0]))
        .to.be.rejected;
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
      expect(MentorshipService.addSessionToMentorship(session, mentorships[0]))
        .to.be.rejected;
    });
  });
});
