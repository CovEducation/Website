import { Router } from "express";

class MainRouter {
  private _router = Router();

  constructor() {
    this.configure();
  }

  get router() {
    return this._router;
  }

  private configure() {
    this.configureAuthRoutes();
    this.configurePublicRoutes();
  }

  private configureAuthRoutes() {}

  private configurePublicRoutes() {
    this.router.get("/heartbeat", (_, res) => {
      res.send({ msg: "alive" });
    });
  }
}

export default new MainRouter().router;
