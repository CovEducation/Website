import { Router } from "express";
import UserRouter from "./users/UserRouter";

class MainRouter {
  private _router = Router();
  private _userSubRouter = UserRouter;

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

    this.router.use("/users", this._userSubRouter);
  }
}

export default new MainRouter().router;
