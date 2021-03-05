import { mongoose } from "@typegoose/typegoose";
import UserService from "../../services/UserService";
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

export const postRequestHandler = async (
  req: PostReqRequest,
  res: PostReqResponse
) => {
  const { mentorID, parentID, message, studentID } = req.body;
  const mentor = await UserService.findMentor(
    new mongoose.Types.ObjectId(mentorID)
  ).catch((err) => {
    res.status(400).send({ err });
    return;
  });
  if (mentor === undefined) {
    res.status(400).send({ err: "Invalid parentID" });
    return;
  }
  const parent = await UserService.findParent(
    new mongoose.Types.ObjectId(parentID)
  ).catch((err) => {
    res.status(400).send({ err });
    return;
  });
  if (parent === undefined) {
    res.status(400).send({ err: "Invalid parentID" });
    return;
  }
  let student;
  parent.students.forEach((stud) => {
    if (stud._id?.toHexString() === studentID) {
      student = stud;
    }
  });
  if (student === undefined) {
    res.status(400).send({ err: "Invalid studentID" });
    return;
  }
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
