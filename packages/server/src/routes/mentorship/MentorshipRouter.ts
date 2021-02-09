import { Router } from "express";

class MentorshipRouter {
  private _router = Router();
  constructor() {
    this.configure();
  }
  get router() {
    return this._router;
  }

  private configure() {
    this.router.post("/request", (_, res) => {
      res.send({});
    });

    this.router.get("/mentorships", (_, res) => {
      res.send({});
    });

    this.router.post("/accept", (_, res) => {
      res.send({});
    });

    this.router.post("/reject", (_, res) => {
      res.send({});
    });

    this.router.post("/archive", (_, res) => res.send({}));

    this.router.post("/session", (_, res) => {
      res.send({});
    });
  }
}

export default new MentorshipRouter().router;
