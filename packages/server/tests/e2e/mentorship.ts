import { setupMocks } from "../utils";
(async () => {
  await setupMocks();
})();
import chai from "chai";
import chaiSubset from "chai-subset";
import { agent, SuperAgentTest } from "supertest";
import { v4 as uuid } from "uuid";
import http from "http";
import createHttpServer from "../../src/server";
import { connect, clearDatabase, closeDatabase } from "../utils";
import UserService from "../../src/services/UserService";
import { IMentor } from "../../src/models/Mentors";
import { IParent } from "../../src/models/Parents";
import { IStudent } from "../../src/models/Students";
import { ISession } from "../../src/models/Sessions";
import { testMentor, testParent } from "../data";

let app: SuperAgentTest;
let server: http.Server;

chai.use(chaiSubset);
const expect = chai.expect;
/**
 * Start a new server & connect to a new in-memory database before running any tests.
 */
before(async function () {
  this.timeout(120000); // 2 mins to download a local MongoDB installation.
  await connect();
  server = await createHttpServer();
  app = agent(server); // Acts as if we are logged in.
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
  const mentor = await UserService.createMentor(testMentor);
  const res = await app
    .post("/users/parent")
    .send({ parent: testParent, token: { uid: testParent.firebaseUID } });
  expect(res.status).to.be.equal(200);
  const parent = res.body;
  const student = parent.students[0];
  return [parent, mentor, student];
};

describe("💾 Server", async () => {
  describe("/mentorships", () => {
    describe("/request", () => {
      it("POST creates a request", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        expect(resp.status).to.be.equal(200);
        const existingMentorships = await app
          .get("/mentorships")
          .query({ user: { _id: parent._id } });
        expect(existingMentorships.status).to.be.equal(200);
        expect(existingMentorships.body.length).to.be.equal(1);
      });

      it("POST blocks double requests", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);

        expect(resp.status).to.be.equal(200);

        const repeat = await app.post("/mentorships/request").send(request);
        expect(repeat.status).to.be.equal(400);
      });

      it("POST can send multiple requests", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);

        expect(resp.status).to.be.equal(200);
        const other = {
          message: "In case the other one doesn't respond",
          mentorID: otherMentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const repeat = await app.post("/mentorships/request").send(other);
        expect(repeat.status).to.be.equal(200);
        const existingMentorships = await app
          .get("/mentorships")
          .query({ user: { _id: parent._id } });
        expect(existingMentorships.status).to.be.equal(200);
        expect(existingMentorships.body.length).to.be.equal(2);
      });

      it("POST validates request", async () => {
        const [parent, mentor, student] = await createUsers();

        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        request.parentID = undefined;
        const resp = await app.post("/mentorships/request").send(request);

        expect(resp.status).to.not.be.equal(200);
      });
    });

    describe("/accept", () => {
      it("POST can accept a request", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        expect(mentorship._id).to.exist;

        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(accept.status).to.be.equal(200);
      });

      it("POST blocks double-acceptance", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(accept.status).to.be.equal(200);
        const blocked = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(blocked.status).to.be.equal(400);
      });

      it("POST cannot mentor student after they have already been accepted by someone else", async () => {
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(accept.status).to.be.equal(200);
        const logoutMentor = await app.post("/logout");
        expect(logoutMentor.status).to.be.equal(200);
        const loginParent = await app.post("/login").send({
          token: { uid: testParent.firebaseUID },
        });
        expect(loginParent.status).to.be.equal(200);
        const otherRequest = {
          message: "Hello! I want one mentorship please.",
          mentorID: otherMentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const newReq = await app
          .post("/mentorships/request")
          .send(otherRequest);
        const otherMentorship = newReq.body;
        const logoutParent = await app.post("/logout");
        expect(logoutParent.status).to.be.equal(200);
        const loginMentor = await app.post("/login").send({
          token: { uid: otherMentor.firebaseUID },
        });
        expect(loginMentor.status).to.be.equal(200);
        const blocked = await app
          .post("/mentorships/accept")
          .send({ mentorship: otherMentorship });
        expect(blocked.status).to.be.equal(400);
      });

      it("POST has validation", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        expect(resp.status).to.be.equal(400);
      });

      it("POST enforces security rules", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: otherMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(accept.status).to.not.be.equal(200);
      });
    });

    describe("/reject", () => {
      it("POST can reject a request", async () => {
        const [parent, mentor, student] = await createUsers();

        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const reject = await app
          .post("/mentorships/reject")
          .send({ mentorship });
        expect(reject.status).to.be.equal(200);
      });

      it("POST blocks double-rejection", async () => {
        const [parent, mentor, student] = await createUsers();

        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const reject = await app
          .post("/mentorships/reject")
          .send({ mentorship });
        expect(reject.status).to.be.equal(200);
        const blocked = await app
          .post("/mentorships/reject")
          .send({ mentorship });
        expect(blocked.status).to.be.equal(400);
      });

      it("POST mentor can accept another request after rejecting a request", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherParent = await UserService.createParent({
          ...testParent,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const otherRequest = {
          message: "Hello! I want one mentorship please.",
          parentID: otherParent._id,
          studentID: otherParent.students[0]._id,
          mentorID: mentor._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        await app.post("/logout");
        const parentLoggedIn = await app.post("/login").send({
          token: { uid: otherParent.firebaseUID },
        });
        expect(parentLoggedIn.status).to.be.equal(200);
        const otherResp = await app
          .post("/mentorships/request")
          .send(otherRequest);
        const otherMentorship = otherResp.body;
        expect(otherResp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const reject = await app
          .post("/mentorships/reject")
          .send({ mentorship });
        expect(reject.status).to.be.equal(200);
        const blocked = await app
          .post("/mentorships/accept")
          .send({ mentorship: otherMentorship });
        expect(blocked.status).to.be.equal(200);
      });

      // TODO(johancc) - Reenable test when the mentorship service has been updated to use
      // security.
      it.skip("POST enforces security rules", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);

        const accept = await app
          .post("/mentorships/reject")
          .send({ mentorship });
        expect(accept.status).to.not.be.equal(200);

        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: otherMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);

        const rejectMentorship = await app
          .post("/mentorships/reject")
          .send({ mentorship });
        expect(rejectMentorship.status).to.be.equal(403);
      });
    });

    describe("/archive", () => {
      it("POST archives a mentorship", async () => {
        const [parent, mentor, student] = await createUsers();

        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app
          .post("/mentorships/request")
          .send(request)
          .set({ token: parent.firebaseUID });
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        await app.post("/mentorships/accept").send({ mentorship });
        const archive = await app
          .post("/mentorships/archive")
          .send({ mentorship });
        expect(archive.status).to.be.equal(200);
      });

      it("POST blocks double archivals", async () => {
        const [parent, mentor, student] = await createUsers();

        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(accept.status).to.be.equal(200);
        const archive = await app
          .post("/mentorships/archive")
          .send({ mentorship });
        expect(archive.status).to.be.equal(200);
        const blocked = await app
          .post("/mentorships/archive")
          .send({ mentorship });
        expect(blocked.status).to.be.equal(400);
      });

      it("POST blocks archiving a mentorship that is not yours", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        await app.post("/mentorships/accept").send({ mentorship });
        const logoutOther = await app.post("/logout");
        expect(logoutOther.status).to.be.equal(200);
        const loginOther = await app.post("/login").send({
          token: { uid: otherMentor.firebaseUID },
        });
        expect(loginOther.status).to.be.equal(200);
        const archive = await app
          .post("/mentorships/archive")
          .send({ mentorship });
        expect(archive.status).to.be.equal(403);
      });

      it("POST allows you to start a new mentorship after archiving", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const otherRequest = {
          message: "Hello! I want one mentorship please.",
          mentorID: otherMentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        await app.post("/mentorships/accept").send({ mentor, mentorship });
        const archive = await app
          .post("/mentorships/archive")
          .send({ mentor, mentorship });
        expect(archive.status).to.be.equal(200);
        const logoutMentor = await app.post("/logout");
        expect(logoutMentor.status).to.be.equal(200);
        const loginParent = await app.post("/login").send({
          token: { uid: testParent.firebaseUID },
        });
        expect(loginParent.status).to.be.equal(200);
        const newResp = await app
          .post("/mentorships/request")
          .send(otherRequest);
        const newMentorship = newResp.body;
        expect(resp.status).to.be.equal(200);
        const logoutParent = await app.post("/logout");
        expect(logoutParent.status).to.be.equal(200);
        const loginMentor = await app.post("/login").send({
          token: { uid: otherMentor.firebaseUID },
        });
        expect(loginMentor.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship: newMentorship });
        expect(accept.status).to.be.equal(200);
      });

      it("POST enforces security rules", async () => {
        const [parent, mentor, student] = await createUsers();
        const otherMentor = await UserService.createMentor({
          ...testMentor,
          email: "test@email.com",
          firebaseUID: uuid(),
        });
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: otherMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const archive = await app
          .post("/mentorships/archive")
          .send({ mentorship });
        expect(archive.status).to.be.equal(403);
      });

      it("POST saves mentorship into history", async () => {
        const [parent, mentor, student] = await createUsers();

        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        await app.post("/mentorships/accept").send({ mentor, mentorship });
        await app.post("/mentorships/archive").send({ mentor, mentorship });

        const history = await app
          .get("/mentorships")
          .query({ user: { _id: student._id } });
        expect(history.status).to.be.equal(200);
        expect(history.body.length).to.be.equal(1);
      });
    });

    describe("/session", () => {
      it("POST adds a session", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app
          .post("/mentorships/request")
          .send(request)
          .set({ token: parent.firebaseUID });
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentorship });
        expect(accept.status).to.be.equal(200);
        const session: ISession = {
          date: new Date(),
          durationMinutes: 60,
          rating: 0.95,
        };
        const addSession = await app
          .post("/mentorships/session")
          .send({ mentorship, session });
        expect(addSession.status).to.be.equal(200);

        const mentorships = await app
          .get("/mentorships")
          .query({ user: { _id: mentor._id?.toHexString() } });
        expect(mentorships.status).to.be.equal(200);
        // Objects become strings over the wire
        const prev = mentorships.body[0].sessions[0];
        prev.date = new Date(prev.date);
        expect(prev).to.be.deep.equal(session);
      });

      it("POST can add multiple sessions", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app
          .post("/mentorships/request")
          .send(request)
          .set({ token: parent.firebaseUID });
        const mentorship = resp.body;
        expect(resp.status).to.be.equal(200);
        const logout = await app.post("/logout");
        expect(logout.status).to.be.equal(200);
        const login = await app.post("/login").send({
          token: { uid: testMentor.firebaseUID },
        });
        expect(login.status).to.be.equal(200);
        const accept = await app
          .post("/mentorships/accept")
          .send({ mentor, mentorship });
        expect(accept.status).to.be.equal(200);
        const session: ISession = {
          date: new Date(),
          durationMinutes: 60,
          rating: 0.95,
        };
        const addSession = await app
          .post("/mentorships/session")
          .send({ mentorship, session });
        expect(addSession.status).to.be.equal(200);
        const newSession: ISession = {
          date: new Date(),
          durationMinutes: 60,
          rating: 0.5,
        };
        const addNewSession = await app
          .post("/mentorships/session")
          .send({ mentorship, session: newSession });
        expect(addNewSession.status).to.be.equal(200);
      });
    });

    describe("/mentorships", () => {
      it("GET gets mentorships", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);

        expect(resp.status).to.be.equal(200);

        const existingMentorshipsStudent = await app
          .get("/mentorships")
          .query({ user: { _id: student._id } });
        expect(existingMentorshipsStudent.status).to.be.equal(200);
        expect(existingMentorshipsStudent.body.length).to.be.equal(1);

        const existingMentorshipsParent = await app
          .get("/mentorships")
          .query({ user: { _id: parent._id } });
        expect(existingMentorshipsParent.status).to.be.equal(200);
        expect(existingMentorshipsParent.body.length).to.be.equal(1);
        const existingMentorshipsMentor = await app
          .get("/mentorships")
          .query({ user: { _id: mentor._id?.toHexString() } });
        expect(existingMentorshipsMentor.status).to.be.equal(200);
        expect(existingMentorshipsMentor.body.length).to.be.equal(1);
      });

      it("GET can get mentorships of an specific student", async () => {
        const mentor = await UserService.createMentor(testMentor);
        const createParent = await app.post("/users/parent").send({
          parent: {
            ...testParent,
            students: [...testParent.students, testParent.students[0]],
          },
          token: { uid: testParent.firebaseUID },
        });
        expect(createParent.status).to.be.equal(200);
        const parent = createParent.body;
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: parent.students[0]._id,
        };
        const resp = await app.post("/mentorships/request").send(request);

        expect(resp.status).to.be.equal(200);
        const otherRequest = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: parent.students[1]._id,
        };
        const otherResp = await app
          .post("/mentorships/request")
          .send(otherRequest);
        expect(otherResp.status).to.be.equal(200);
        const firstStudentMentorships = await app
          .get("/mentorships")
          .query({ user: { _id: parent.students[0]._id } });
        expect(firstStudentMentorships.status).to.be.equal(200);
        expect(firstStudentMentorships.body.length).to.be.equal(1);
        expect(firstStudentMentorships.body[0].student._id).to.be.equal(
          parent.students[0]._id
        );
        const secondStudentMentorships = await app
          .get("/mentorships")
          .query({ user: { _id: parent.students[1]._id } });
        expect(secondStudentMentorships.status).to.be.equal(200);
        expect(secondStudentMentorships.body.length).to.be.equal(1);
        expect(secondStudentMentorships.body[0].student._id).to.be.equal(
          parent.students[1]._id
        );
      });

      it("GET handles invalid user _id", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);
        expect(resp.status).to.be.equal(200);
      });

      it("GET populates the users", async () => {
        const [parent, mentor, student] = await createUsers();
        const request = {
          message: "Hello! I want one mentorship please.",
          mentorID: mentor._id,
          parentID: parent._id,
          studentID: student._id,
        };
        const resp = await app.post("/mentorships/request").send(request);

        expect(resp.status).to.be.equal(200);
        const existingMentorshipsStudent = await app.get("/mentorships");
        expect(existingMentorshipsStudent.status).to.be.equal(200);
        expect(existingMentorshipsStudent.body.length).to.be.equal(1);
        expect(existingMentorshipsStudent.body[0]._id).to.exist;
        expect(existingMentorshipsStudent.body[0].student).to.exist;
        expect(existingMentorshipsStudent.body[0].parent).to.exist;
        expect(existingMentorshipsStudent.body[0].mentor).to.exist;
        expect(existingMentorshipsStudent.body[0].student.name).to.be.equal(
          student.name
        );
        expect(existingMentorshipsStudent.body[0].parent.name).to.be.equal(
          parent.name
        );
        expect(existingMentorshipsStudent.body[0].mentor.name).to.be.equal(
          mentor.name
        );
        expect(existingMentorshipsStudent.body[0].student._id).to.be.equal(
          student._id
        );
        expect(existingMentorshipsStudent.body[0].parent._id).to.be.equal(
          parent._id
        );
        // Mentors are made directly from UserService by the tester, so we
        // need to convert back.
        expect(existingMentorshipsStudent.body[0].mentor._id).to.be.equal(
          mentor._id?.toHexString()
        );
      });
    });
  });
});
