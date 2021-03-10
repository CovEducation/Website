import { Router } from "express";
import {
  getMentorValidation,
  postMentorValidation,
  deleteMentorValidation,
  getParentValidation,
  postParentValidation,
  deleteParentValidation,
  putParentValidation,
  putMentorValidation,
} from "./validation";
import {
  getMentorHandler,
  postMentorHandler,
  putMentorHandler,
  deleteMentorHandler,
  getParentHandler,
  postParentHandler,
  deleteParentHandler,
  putParentHandler,
} from "./handlers";
import validate from "../../middleware/validation";
import { ensureLoggedIn, verifyFirebaseToken } from "../../middleware/auth";

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

    this.router.put(
      "/mentor",
      ensureLoggedIn,
      putMentorValidation,
      validate,
      putMentorHandler
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
    this.router.put(
      "/parent",
      ensureLoggedIn,
      putParentValidation,
      validate,
      putParentHandler
    );
  }

  private configurePublicRoutes() {
    this.router.post(
      "/mentor",
      verifyFirebaseToken,
      postMentorValidation,
      validate,
      postMentorHandler
    );
    this.router.post(
      "/parent",
      verifyFirebaseToken,
      postParentValidation,
      validate,
      postParentHandler
    );
  }
}

export default new UserRouter().router;
