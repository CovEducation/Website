import { expect } from "chai";
import { agent, SuperAgentTest } from "supertest";
import http from "http";
import createHttpServer from "../../src/server";
import { testMentor } from "../data";
import { IMentor } from "../../src/models/Mentors";
import { mongoose } from "@typegoose/typegoose";

let app: SuperAgentTest;
let server: http.Server;
before(async () => {
  server = await createHttpServer();
  app = agent(server);
});

describe("💻 Server", () => {
  it("has a heartbeat", async () => {
    const res = await app.get("/heartbeat");
    expect(res.status).to.equal(200);
  });

  describe("/users 👨‍💻", () => {
    it("/mentor POST - creates new user", async () => {
      const res = await app.post("/users/mentor").send(testMentor);
      expect(res.status).to.be.equal(200);
      expect(res.body._id).to.exist;
      expect(res.body as IMentor).to.deep.contain(testMentor);
    });

    it("/mentor POST - rejects empty requests", async () => {
      const res = await app.post("/users/mentor");
      expect(res.status).to.be.equal(400);
    });

    it("/mentor POST - rejects partial data", async () => {
      const res = await app
        .post("/users/mentor")
        .send({ name: "Alyssa P Hacker" });
      expect(res.status).to.be.equal(400);
    });

    it("/mentor POST - rejects invalid data", async () => {
      const res = await app
        .post("/users/mentor")
        .send({ name: "Alyssa P Hacker", firebaseUID: "" });
      expect(res.status).to.be.equal(400);
    });

    it("/mentor GET - gets a mentor", async () => {
      const setup = await app.post("/users/mentor").send(testMentor);
      expect(setup.status).to.be.equal(200);

      const res = await app.get("/users/mentor").query({ _id: setup.body._id });
      expect(res.status).to.be.equal(200);
    });

    it("/mentor GET - rejects invalid id", async () => {
      const res = await app.get("/users/mentor").query({ _id: "" });
      expect(res.status).to.be.equal(400);
    });

    it("/mentor GET - rejects non-existent id", async () => {
      const res = await app
        .get("/users/mentor")
        .query({ _id: mongoose.Types.ObjectId() });
      expect(res.status).to.be.equal(400);
    });
  });
});
