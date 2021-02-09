import chai from "chai";
import chaiSubset from "chai-subset";
import { agent, SuperAgentTest } from "supertest";
import { connect, clearDatabase, closeDatabase } from "../utils";

import http from "http";
import createHttpServer from "../../src/server";

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
  app = agent(server);
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await clearDatabase());

/**
 * Remove and close the db and server.
 */
after(async () => await closeDatabase());

describe("💾 Server", async () => {
  describe("/mentorships", () => {
    describe("/request", () => {
      it("POST creates a request", async () => {
        expect(app).to.not.be.undefined;
      });

      it("POST sends an email", async () => {});

      it("POST sends an SMS", async () => {});

      it("POST blocks double requests", async () => {});

      it("POST can send multiple requests", async () => {});

      it("POST validates request", async () => {});
    });

    describe("/accept", () => {
      it("POST can accept a request", async () => {});

      it("POST blocks double-acceptance", async () => {});

      it("POST cannot mentor student after they have already been accepted by someone else", async () => {});

      it("POST has validation", async () => {});

      it("POST enforces security rules", async () => {});
    });

    describe("/reject", () => {
      it("POST can reject a request", async () => {});

      it("POST blocks double-rejection", async () => {});

      it("POST accept another request after rejecting a request", async () => {});

      it("POST has validation", async () => {});

      it("POST enforces security rules", async () => {});
    });

    describe("/archive", () => {
      it("POST archives a mentorship", async () => {});

      it("POST blocks double archivals", async () => {});

      it("POST blocks archiving a mentorship that is not yours", async () => {});

      it("POST allows you to start a new mentorship after archiving", async () => {});

      it("POST validates request", async () => {});

      it("POST saves mentorship into history", async () => {});
    });

    describe("/session", () => {
      it("POST adds a session", async () => {});

      it("POST can add multiple sessions", async () => {});

      it("POST can only session add to active mentorship", async () => {});

      it("POST validates request", async () => {});

      it("POST handles invalid mentorship._id", async () => {});
    });

    describe("/mentorships", () => {
      it("GET gets mentorshios", async () => {});

      it("POST gets mentorships regardless of state", async () => {});

      it("POST can get mentorships of an specific student", async () => {});

      it("POST handles invalid user _id", async () => {});
    });
  });
});
