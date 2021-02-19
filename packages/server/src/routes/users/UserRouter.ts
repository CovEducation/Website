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
import { ensureLoggedIn } from "../../middleware/auth";

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

  private configureAuthRoutes() {
    this.router.get(
      "/mentor",
      ensureLoggedIn,
      getMentorValidation,
      validate,
      getMentorHandler
    );
    this.router.delete(
      "/mentor",
      ensureLoggedIn,
      deleteMentorValidation,
      validate,
      deleteMentorHandler
    );
    this.router.get(
      "/parent",
      ensureLoggedIn,
      getParentValidation,
      validate,
      getParentHandler
    );
    this.router.delete(
      "/parent",
      ensureLoggedIn,
      deleteParentValidation,
      validate,
      deleteParentHandler
    );
  }

  private configurePublicRoutes() {
    this.router.post(
      "/mentor",
      postMentorValidation,
      validate,
      postMentorHandler
    );
    this.router.post(
      "/parent",
      postParentValidation,
      validate,
      postParentHandler
    );
  }
}

export default new UserRouter().router;
