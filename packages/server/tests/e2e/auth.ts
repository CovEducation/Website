import { setupMocks } from "../utils";
(async () => {
  await setupMocks();
})();

import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import { agent, SuperAgentTest } from "supertest";
import http from "http";
import { connect, clearDatabase, closeDatabase } from "../utils";
import createHttpServer from "../../src/server";
import { testParent } from "../data";
import mongoose from "mongoose";

let app: SuperAgentTest;
let server: http.Server;

chai.use(chaiSubset);
/**
 * Start a new server & connect to a new in-memory database before running any tests.
 */
before(async function () {
  this.timeout(120000); // 2 mins to download a local MongoDB installation.
  await connect();
  await createHttpServer().then((s) => {
    server = s;
    app = agent(server);
  });
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => {
  await clearDatabase();
  await app.post("/logout");
});

/**
 * Remove and close the db and server.
 */
after(async () => closeDatabase());

describe("🔒 Auth", () => {
  describe("/login", () => {
    it("can log in", async () => {
      const setup = await app
        .post("/users/parent")
        .send({ parent: testParent, token: { uid: testParent.firebaseUID } });
      const out = await app.post("/logout");
      expect(setup.status).to.be.equal(200);
      expect(out.status).to.be.equal(200);
      const login = await app
        .post("/login")
        .send({ token: { uid: testParent.firebaseUID } });
      expect(login.status).to.be.equal(200);
    });

    it("can login twice", async () => {
      const setup = await app
        .post("/users/parent")
        .send({ parent: testParent, token: { uid: testParent.firebaseUID } });
      expect(setup.status).to.be.equal(200);
      const out = await app.post("/logout");
      expect(out.status).to.be.equal(200);

      const login = await app
        .post("/login")
        .send({ token: { uid: testParent.firebaseUID } });
      expect(login.status).to.be.equal(200);
      const double = await app
        .post("/login")
        .send({ token: { uid: testParent.firebaseUID } });
      expect(double.status).to.be.equal(200);
    });
  });

  describe("/logout", () => {
    it("can logout", async () => {
      const setup = await app
        .post("/users/parent")
        .send({ parent: testParent, token: { uid: testParent.firebaseUID } });
      expect(setup.status).to.be.equal(200);
      const out = await app.post("/logout");
      expect(out.status).to.be.equal(200);
    });

    it("cannot logged out if not logged in", async () => {
      const out = await app.post("/logout");
      expect(out.status).to.be.equal(400);
    });
  });

  describe("/users 😷", () => {
    describe("/mentor", () => {
      it("DELETE - prevents deleting when logged out", async () => {
        const setup = await app
          .post("/users/parent")
          .send({ parent: testParent, token: { uid: testParent.firebaseUID } });
        const del = await app
          .delete("/users/parent")
          .send({ _id: setup.body._id });
        expect(del.status).to.be.equal(200);
        const res = await app
          .delete("/users/parent")
          .send({ _id: setup.body._id });
        expect(res.status).to.be.equal(401);
      });

      it("DELETE - enforces authentication", async () => {
        const res = await app
          .delete("/users/parent")
          .send({ _id: mongoose.Types.ObjectId().toHexString() });
        expect(res.status).to.be.equal(401);
      });

      it("DELETE - rejects invalid requests", async () => {
        const res = await app.delete("/users/parent").send({ _id: 8 });
        expect(res.status).to.be.equal(401);
      });
    });
  });
});
