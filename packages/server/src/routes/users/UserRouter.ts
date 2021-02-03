import { Router } from "express";
import {
  getMentorValidation,
  postMentorValidation,
  deleteMentorValidation,
  getParentValidation,
  postParentValidation,
  deleteParentValidation,
} from "./validation";
import {
  getMentorHandler,
  postMentorHandler,
  deleteMentorHandler,
  getParentHandler,
  postParentHandler,
  deleteParentHandler,
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
    this.setupMentorRoutes();
    this.setupParentRoutes();
  }

  private setupMentorRoutes() {
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

  private setupParentRoutes() {
    this.router.get("/parent", getParentValidation, validate, getParentHandler);
    this.router.post(
      "/parent",
      postParentValidation,
      validate,
      postParentHandler
    );
    this.router.delete(
      "/parent",
      deleteParentValidation,
      validate,
      deleteParentHandler
    );
  }
}

export default new UserRouter().router;
