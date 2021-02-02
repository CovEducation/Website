import { Router } from "express";
import { getMentorValidation, postMentorValidation } from "./validation";
import { getMentorHandler, postMentorHandler } from "./handlers";
import validate from "../../middleware/validation";

class UserRouter {
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
    this.router.post(
      "/mentor",
      postMentorValidation,
      validate,
      postMentorHandler
    );

    this.router.get("/mentor", getMentorValidation, validate, getMentorHandler);
  }
}

export default new UserRouter().router;
