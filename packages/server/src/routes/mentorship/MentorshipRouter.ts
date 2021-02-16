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
      getMentorshipsValidation,
      validate,
      getMentorshipHandler
    );

    this.router.post(
      "/request",
      postRequestValidation,
      validate,
      postRequestHandler
    );

    this.router.post(
      "/accept",
      acceptMentorshipValidation,
      validate,
      postAcceptRequestHandler
    );

    this.router.post(
      "/reject",
      rejectMentorshipValidation,
      validate,
      postRejectRequestHandler
    );

    this.router.post(
      "/archive",
      archiveMentorshipValidation,
      validate,
      postArchiveMentorshipHandler
    );

    this.router.post(
      "/session",
      postSessionValidation,
      validate,
      postSessionHandler
    );
  }
}

export default new MentorshipRouter().router;
