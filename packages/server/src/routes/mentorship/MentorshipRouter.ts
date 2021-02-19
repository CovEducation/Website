import { Router } from "express";
import validate from "../../middleware/validation";
import {
  acceptMentorshipValidation,
  archiveMentorshipValidation,
  getMentorshipsValidation,
  postRequestValidation,
  postSessionValidation,
  rejectMentorshipValidation,
} from "./validation";
import {
  postRequestHandler,
  postAcceptRequestHandler,
  postRejectRequestHandler,
  postArchiveMentorshipHandler,
  postSessionHandler,
  getMentorshipHandler,
} from "./handlers";
import { ensureLoggedIn } from "../../middleware/auth";

class MentorshipRouter {
  private _router = Router();
  constructor() {
    this.configure();
  }
  get router() {
    return this._router;
  }

  private configure() {
    this.router.get(
      "/",
      ensureLoggedIn,
      getMentorshipsValidation,
      validate,
      getMentorshipHandler
    );

    this.router.post(
      "/request",
      ensureLoggedIn,
      postRequestValidation,
      validate,
      postRequestHandler
    );

    this.router.post(
      "/accept",
      ensureLoggedIn,
      acceptMentorshipValidation,
      validate,
      postAcceptRequestHandler
    );

    this.router.post(
      "/reject",
      ensureLoggedIn,
      rejectMentorshipValidation,
      validate,
      postRejectRequestHandler
    );

    this.router.post(
      "/archive",
      ensureLoggedIn,
      archiveMentorshipValidation,
      validate,
      postArchiveMentorshipHandler
    );

    this.router.post(
      "/session",
      ensureLoggedIn,
      postSessionValidation,
      validate,
      postSessionHandler
    );
  }
}

export default new MentorshipRouter().router;
