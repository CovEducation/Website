import { expect } from "chai";
import { agent, SuperAgentTest } from "supertest";
import http from "http";
import createHttpServer from "../../src/server";

let app: SuperAgentTest;
let server: http.Server;
before(async () => {
  server = await createHttpServer();
  app = agent(server);
});

describe("Server", () => {
  it("has a heartbeat", async () => {
    const res = await app.get("/heartbeat");
    expect(res.status).to.equal(200);
  });
  describe("GET /doubleNum", () => {
    it("doubles numbers", async () => {
      const res = await app.get("/doubleNum?num=10");
      expect(res.status).to.equal(200);
      expect(res.body.num).to.equal(20);
    });
    it("blocks invalid parameters", async () => {
      const res = await app.get("/doubleNum?num=seven");
      expect(res.status).to.equal(400);
    });
    it("blocks invalid requests", async () => {
      const res = await app.get("/doubleNum");
      expect(res.status).to.equal(400);
    });
  });

  describe("POST /num", () => {
    it("saves numbers", async () => {
      const res = await app.post("/num").send({ num: 10 });
      expect(res.status).to.equal(200);
      expect(res.body.num).to.equal(10);
    });
  });
});
