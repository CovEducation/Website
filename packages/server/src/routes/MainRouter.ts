import { Router } from "express";
import UserRouter from "./users/UserRouter";
import MentorshipRouter from "./mentorship/MentorshipRouter";
import { login, logout } from "../middleware/auth";

class MainRouter {
  private _router = Router();
  private _userSubRouter = UserRouter;
  private _mentorshipSubRouter = MentorshipRouter;
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
    this.router.get("/heartbeat", (_, res) => res.send({ msg: "alive" }));
    this.router.use("/login", login);
    this.router.use("/logout", logout);
    this.router.use("/users", this._userSubRouter);
    this.router.use("/mentorships", this._mentorshipSubRouter);
  }
}

export default new MainRouter().router;
