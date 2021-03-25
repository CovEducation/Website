import { mongoose } from "@typegoose/typegoose";
import UserService from "../../services/UserService";
import MentorshipService, {
  MentorshipRequest,
} from "../../services/MentorshipService";
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
import { ensureIDsAreEqual } from "../utils";
import { Mentor } from "../../models/Mentors";
import { Parent } from "src/models/Parents";

export const postRequestHandler = async (
  req: PostReqRequest,
  res: PostReqResponse
) => {
  const { mentorID, parentID, message, studentID } = req.body;
  const userID = req.session.userId;
  if (userID === undefined || !ensureIDsAreEqual(parentID, userID)) {
    res
      .status(403)
      .send({ err: "Only a parent can send a mentorship request." });
    return;
  }
  const mentor = await UserService.findMentor(
    mongoose.Types.ObjectId(mentorID)
  ).catch((err) => {
    res.status(400).send({ err });
    return;
  });
  if (mentor === undefined) {
    res.status(400).send({ err: "Invalid mentorID" });
    return;
  }
  const parent = await UserService.findParent(
    mongoose.Types.ObjectId(parentID)
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
  const request: MentorshipRequest = {
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
      console.log(err);
      res.status(400).send({ err });
    });
};

export const postAcceptRequestHandler = async (
  req: PostAcceptMentorshipRequest,
  res: PostAcceptMentorshipResponse
) => {
  const { mentorship } = req.body;
  // The user logged in must be the mentor that can accept the request.
  const _id = req.session.userId;
  if (_id === undefined) {
    res
      .status(403)
      .send({ err: "Mentor must be signed in to accept request." });
    return;
  }

  const userMentorships = await MentorshipService.getCurrentMentorships(
    mongoose.Types.ObjectId(String(_id))
  );

  const pendingMentorship = userMentorships.filter((v) =>
    ensureIDsAreEqual(v._id, mentorship._id || "")
  );
  if (pendingMentorship.length != 1) {
    res.status(400).send({ err: "Invalid mentorship._id" });
    return;
  }
  let mentor = pendingMentorship[0].mentor;
  let mentorID;
  if (mentor === undefined) {
    res.status(500).send();
    return;
  }

  if (
    mentor instanceof mongoose.Types.ObjectId ||
    mentor instanceof String ||
    typeof mentor === "string"
  ) {
    mentorID = mentor;
  } else {
    mentorID = (mentor as Mentor)._id;
  }
  if (!ensureIDsAreEqual(mentorID, _id)) {
    res.status(403).send({ err: "Only the mentor can accept a mentorship." });
    return;
  }
  MentorshipService.acceptRequest(pendingMentorship[0])
    .then(() => res.send({}))
    .catch((err) => {
      res.status(400).send({ err });
    });
};

export const postRejectRequestHandler = (
  req: PostRejectMentorshipRequest,
  res: PostRejectMentorshipResponse
) => {
  const { mentorship } = req.body;

  let mentorID;

  if (
    mentorship.mentor instanceof mongoose.Types.ObjectId ||
    typeof mentorship.mentor === "string"
  ) {
    mentorID = mentorship.mentor;
  } else {
    mentorID = (mentorship.mentor as Mentor)._id;
  }
  if (
    req.session.userId !== undefined &&
    ensureIDsAreEqual(mentorID, req.session.userId)
  ) {
    MentorshipService.rejectRequest(mentorship)
      .then(() => res.send({}))
      .catch((err) => {
        res.status(400).send({ err });
      });
  } else {
    res.status(403).end();
  }
};

export const postArchiveMentorshipHandler = (
  req: PostArchiveMentorshipRequest,
  res: PostArchiveMentorshipResponse
) => {
  const { mentorship } = req.body;
  let parentID;

  if (
    mentorship.parent instanceof mongoose.Types.ObjectId ||
    mentorship.parent instanceof String ||
    typeof mentorship.parent === "string"
  ) {
    parentID = mentorship.parent;
  } else {
    parentID = (mentorship.parent as Parent)._id;
  }

  let mentorID;

  if (
    mentorship.mentor instanceof mongoose.Types.ObjectId ||
    typeof mentorship.mentor === "string"
  ) {
    mentorID = mentorship.mentor;
  } else {
    mentorID = (mentorship.mentor as Mentor)._id;
  }
  if (
    req.session.userId == undefined ||
    (!ensureIDsAreEqual(mentorID, req.session.userId) &&
      !ensureIDsAreEqual(parentID, req.session.userId))
  ) {
    res.status(403).end();
  } else {
    MentorshipService.archiveMentorship(mentorship)
      .then(() => res.send({}))
      .catch((err) => {
        res.status(400).send({ err });
      });
  }
};

export const postSessionHandler = (
  req: PostSessionRequest,
  res: PostSessionResponse
) => {
  const { session, mentorship } = req.body;
  MentorshipService.addSessionToMentorship(session, mentorship)
    .then(() => {
      res.send({});
    })
    .catch((err) => res.status(400).send({ err }));
};

export const getMentorshipHandler = (
  req: GetMentorshipsRequest,
  res: GetMentorshipsResponse
) => {
  const _id = req.query?.user?._id || String(req.session.userId);
  if (_id === undefined) {
    res.status(400).end();
    return;
  }
  MentorshipService.getCurrentMentorships(mongoose.Types.ObjectId(_id))
    .then((mentorships) => {
      res.send(mentorships);
    })
    .catch(() => {
      res.status(400);
    });
};
