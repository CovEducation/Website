import { mongoose } from "@typegoose/typegoose";
import MentorshipService from "../../services/MentorshipService";
import {
  GetMentorshipsRequest,
  GetMentorshipsResponse,
  PostAcceptMentorshipRequest,
  PostAcceptMentorshipResponse,
  PostArchiveMentorshipRequest,
  PostArchiveMentorshipResponse,
  PostRejectMentorshipRequest,
  PostRejectMentorshipResponse,
  PostReqRequest,
  PostReqResponse,
  PostSessionRequest,
  PostSessionResponse,
} from "./interfaces";

export const postRequestHandler = (
  req: PostReqRequest,
  res: PostReqResponse
) => {
  const { mentor, parent, message, student } = req.body;

  const request = {
    mentor,
    parent,
    student,
    message,
  };
  MentorshipService.sendRequest(request)
    .then((mentorship) => {
      res.send(mentorship);
    })
    .catch((err) => {
      res.status(400).send({ err });
    });
};

export const postAcceptRequestHandler = (
  req: PostAcceptMentorshipRequest,
  res: PostAcceptMentorshipResponse
) => {
  const { mentorship } = req.body;
  // The user logged in must be the mentor that can accept the request.
  if (req.session.userId !== mentorship.mentor) {
    res.status(403).send();
  } else {
    MentorshipService.acceptRequest(mentorship)
      .then(() => res.send({}))
      .catch((err) => {
        res.status(400).send({ err });
      });
  }
};

export const postRejectRequestHandler = (
  req: PostRejectMentorshipRequest,
  res: PostRejectMentorshipResponse
) => {
  const { mentorship } = req.body;
  // The user logged in must be the mentor that can reject the request.
  if (req.session.userId !== mentorship.mentor) {
    res.status(403).send();
  } else {
    MentorshipService.rejectRequest(mentorship)
      .then(() => res.send({}))
      .catch((err) => {
        res.status(400).send({ err });
      });
  }
};

export const postArchiveMentorshipHandler = (
  req: PostArchiveMentorshipRequest,
  res: PostArchiveMentorshipResponse
) => {
  const { mentorship } = req.body;

  if (req.session.userId !== mentorship.mentor) {
    res.status(403).send();
  } else {
    MentorshipService.archiveMentorship(mentorship)
      .then(() => res.send({}))
      .catch((err) => res.status(400).send({ err }));
  }
};

export const postSessionHandler = (
  req: PostSessionRequest,
  res: PostSessionResponse
) => {
  const { session, mentorship } = req.body;
  MentorshipService.addSessionToMentorship(session, mentorship)
    .then((mentorship) => {
      res.send(mentorship);
    })
    .catch((err) => res.status(400).send({ err }));
};

export const getMentorshipHandler = (
  req: GetMentorshipsRequest,
  res: GetMentorshipsResponse
) => {
  const _id = mongoose.Types.ObjectId(req.query.user._id) || req.session.userId;
  if (_id === undefined) {
    res.status(400).end();
    return;
  }
  return MentorshipService.getCurrentMentorships(_id)
    .then((mentorships) => {
      res.send(mentorships);
    })
    .catch(() => {
      res.status(400);
    });
};
