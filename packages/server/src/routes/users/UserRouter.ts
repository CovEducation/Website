import { Router } from "express";
import { postUserHandler } from "./handlers";
import validation from "./validation";
import validator from "../../middleware/validation";

class UserRouter {
  private _router = Router();

  contructor() {
    this.configure();
  }

  get router() {
    return this._router;
  }

  private configure() {
    this.configureAuthRoutes();
    this.configurePublicRoutes();
  }

  private configurePublicRoutes() {
    this._router.post(
      "/",
      validation.postMentorValidation,
      validator,
      postUserHandler
    );
  }

  private configureAuthRoutes() {}
}

export default UserRouter;
