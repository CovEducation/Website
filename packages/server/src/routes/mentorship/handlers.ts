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
  const { mentorship, mentor } = req.body;
  // TODO(johanc): SECURITY - Any mentor can accept any mentorship, as long as they have the object.
  if (mentor._id !== mentorship.mentor) {
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
  const { mentorship, mentor } = req.body;
  // TODO(johanc): SECURITY - Any mentor can accept any mentorship, as long as they have the object.
  if (mentor._id !== mentorship.mentor) {
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
  const { mentorship, mentor } = req.body;
  // TODO(johanc): SECURITY - Any mentor can accept any mentorship, as long as they have the object.
  if (mentor._id !== mentorship.mentor) {
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
  const { user } = req.query;
  const userId = mongoose.Types.ObjectId(user._id);
  return MentorshipService.getCurrentMentorships(userId)
    .then((mentorships) => {
      res.send(mentorships);
    })
    .catch(() => res.status(400));
};
