import { Router } from "express";
import validator from "../../middleware/validation/validator";
import * as validation from "./validation";
import { getDoubleNumHandler, postNumHandler } from "./handlers";

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

    this.router.get(
      "/doubleNum",
      validation.getDoubleValidation,
      validator,
      getDoubleNumHandler
    );

    this.router.post(
      "/num",
      validation.postNumValidation,
      validator,
      postNumHandler
    );
  }
}

export default new MainRouter().router;
