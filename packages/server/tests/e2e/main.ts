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
});
