import { Router } from "express";
import {
  getMentorValidation,
  postMentorValidation,
  deleteMentorValidation,
} from "./validation";
import {
  getMentorHandler,
  postMentorHandler,
  deleteMentorHandler,
} from "./handlers";
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

    this.router.delete(
      "/mentor",
      deleteMentorValidation,
      validate,
      deleteMentorHandler
    );
  }
}

export default new UserRouter().router;
