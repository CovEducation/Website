import chai, { expect } from "chai";
import chaiSubset from "chai-subset";
import { agent, SuperAgentTest } from "supertest";
import { connect, clearDatabase, closeDatabase } from "../utils";

import http from "http";
import createHttpServer from "../../src/server";
import { testMentor, testParent } from "../data";
import { IMentor } from "../../src/models/Mentors";
import mongoose from "mongoose";

let app: SuperAgentTest;
let server: http.Server;

chai.use(chaiSubset);
/**
 * Start a new server & connect to a new in-memory database before running any tests.
 */
before(async function () {
  this.timeout(120000); // 2 mins to download a local MongoDB installation.
  server = await createHttpServer();
  await connect();
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

describe("💻 Server", () => {
  it("is alive", async () => {
    const res = await app.get("/heartbeat");
    expect(res.status).to.equal(200);
  });

  describe("/users 👨‍💻", () => {
    describe("/mentor", () => {
      it("POST - creates new user", async () => {
        const res = await app.post("/users/mentor").send(testMentor);
        expect(res.status).to.be.equal(200);
        expect(res.body._id).to.exist;
        expect(res.body as IMentor).to.deep.contain(testMentor);

        if (res.body._id) {
          const cleanup = await app
            .delete("/users/mentor")
            .send({ _id: res.body._id });
          expect(cleanup.status).to.be.equal(200);
        }
      });

      it("POST - rejects empty requests", async () => {
        const res = await app.post("/users/mentor");
        expect(res.status).to.be.equal(400);
      });

      it("POST - rejects partial data", async () => {
        const res = await app
          .post("/users/mentor")
          .send({ name: "Alyssa P Hacker" });
        expect(res.status).to.be.equal(400);
      });

      it("POST - rejects invalid firebaseUID", async () => {
        const res = await app
          .post("/users/mentor")
          .send({ name: "Alyssa P Hacker", firebaseUID: "" });
        expect(res.status).to.be.equal(400);
      });

      it("POST - rejects invalid phone number", async () => {
        const res = await app
          .post("/users/mentor")
          .send({ name: "Alyssa P Hacker", phone: 0 });
        expect(res.status).to.be.equal(400);
      });

      it("GET - gets a mentor", async () => {
        const setup = await app.post("/users/mentor").send(testMentor);
        expect(setup.status).to.be.equal(200);

        const res = await app
          .get("/users/mentor")
          .query({ _id: setup.body._id });
        expect(res.status).to.be.equal(200);

        if (setup.body._id) {
          const cleanup = await app
            .delete("/users/mentor")
            .send({ _id: setup.body._id });
          expect(cleanup.status).to.be.equal(200);
        }
      });

      it("GET - rejects invalid id", async () => {
        const res = await app.get("/users/mentor").query({ _id: "" });
        expect(res.status).to.be.equal(400);
      });

      it("GET - rejects non-existent id", async () => {
        const res = await app
          .get("/users/mentor")
          .query({ _id: mongoose.Types.ObjectId().toHexString() });
        expect(res.status).to.be.equal(404);
      });

      it("DELETE - deletes a mentor", async () => {
        const setup = await app.post("/users/mentor").send(testMentor);
        const res = await app
          .delete("/users/mentor")
          .send({ _id: setup.body._id });
        expect(res.status).to.be.equal(200);
      });

      it("DELETE - fails nicely", async () => {
        const setup = await app.post("/users/mentor").send(testMentor);
        await app.delete("/users/mentor").send({ _id: setup.body._id });
        const res = await app
          .delete("/users/mentor")
          .send({ _id: setup.body._id });
        expect(res.status).to.be.equal(404);
      });

      it("DELETE - rejects invalid ids", async () => {
        const res = await app
          .delete("/users/mentor")
          .send({ _id: mongoose.Types.ObjectId().toHexString() });
        expect(res.status).to.be.equal(404);
      });

      it("DELETE - rejects invalid requests", async () => {
        const res = await app.delete("/users/mentor").send({ _id: 8 });
        expect(res.status).to.be.equal(400);
      });
    });

    describe("/parent", () => {
      it("POST - creates new parent", async () => {
        const res = await app.post("/users/parent").send(testParent);
        expect(res.status).to.be.equal(200);
        expect(res.body._id).to.exist;
        expect(res.body).to.containSubset(testParent);

        if (res.body._id) {
          const cleanup = await app
            .delete("/users/parent")
            .send({ _id: res.body._id });
          expect(cleanup.status).to.be.equal(200);
        }
      });

      it("POST - rejects empty requests", async () => {
        const res = await app.post("/users/parent");
        expect(res.status).to.be.equal(400);
      });

      it("POST - rejects partial data", async () => {
        const res = await app
          .post("/users/parent")
          .send({ name: "Alyssa P Hacker" });
        expect(res.status).to.be.equal(400);
      });

      it("POST - rejects invalid firebaseUID", async () => {
        const res = await app
          .post("/users/parent")
          .send({ name: "Alyssa P Hacker", firebaseUID: "0000" });
        expect(res.status).to.be.equal(400);
      });

      it("POST - rejects invalid phone number", async () => {
        const res = await app
          .post("/users/parent")
          .send({ name: "Alyssa P Hacker", phone: 0 });
        expect(res.status).to.be.equal(400);
      });

      it("GET - gets a parent", async () => {
        const setup = await app.post("/users/parent").send(testParent);
        expect(setup.status).to.be.equal(200);

        const res = await app
          .get("/users/parent")
          .query({ _id: setup.body._id });
        expect(res.status).to.be.equal(200);
        expect(res.body).to.containSubset(testParent);
        expect(res.body).to.containSubset(setup.body);
        if (setup.body._id) {
          const cleanup = await app
            .delete("/users/parent")
            .send({ _id: setup.body._id });
          expect(cleanup.status).to.be.equal(200);
        }
      });

      it("GET - rejects invalid id", async () => {
        const res = await app.get("/users/parent").query({ _id: "" });
        expect(res.status).to.be.equal(400);
      });

      it("GET - rejects non-existent id", async () => {
        const res = await app
          .get("/users/parent")
          .query({ _id: mongoose.Types.ObjectId().toHexString() });
        expect(res.status).to.be.equal(404);
      });

      it("DELETE - deletes a parent", async () => {
        const setup = await app.post("/users/parent").send(testParent);
        const res = await app
          .delete("/users/parent")
          .send({ _id: setup.body._id });
        expect(res.status).to.be.equal(200);
      });

      it("DELETE - fails nicely", async () => {
        const setup = await app.post("/users/parent").send(testParent);
        await app.delete("/users/parent").send({ _id: setup.body._id });
        const res = await app
          .delete("/users/parent")
          .send({ _id: setup.body._id });
        expect(res.status).to.be.equal(404);
      });

      it("DELETE - rejects invalid ids", async () => {
        const res = await app
          .delete("/users/parent")
          .send({ _id: mongoose.Types.ObjectId().toHexString() });
        expect(res.status).to.be.equal(404);
      });

      it("DELETE - rejects invalid requests", async () => {
        const res = await app.delete("/users/parent").send({ _id: 8 });
        expect(res.status).to.be.equal(400);
      });
    });
  });
});
