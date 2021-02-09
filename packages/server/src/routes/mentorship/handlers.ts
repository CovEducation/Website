import { mongoose } from "@typegoose/typegoose";
import MentorshipService from "src/services/MentorshipService";
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
  MentorshipService.sendRequest(request).then((mentorship) => {
    res.send(mentorship);
  });
};

export const postAcceptRequestHandler = (
  req: PostAcceptMentorshipRequest,
  res: PostAcceptMentorshipResponse
) => {
  const { mentorship } = req.body;
  MentorshipService.acceptRequest(mentorship).then(() => res.send({}));
};

export const postRejectRequestHandler = (
  req: PostRejectMentorshipRequest,
  res: PostRejectMentorshipResponse
) => {
  const { mentorship } = req.body;
  MentorshipService.rejectRequest(mentorship).then(() => res.send({}));
};

export const postArchiveMentorshipHandler = (
  req: PostArchiveMentorshipRequest,
  res: PostArchiveMentorshipResponse
) => {
  const { mentorship } = req.body;
  MentorshipService.archiveMentorship(mentorship).then(() => res.send({}));
};

export const postSessionHandler = (
  req: PostSessionRequest,
  res: PostSessionResponse
) => {
  const { session, mentorship } = req.body;
  MentorshipService.addSessionToMentorship(session, mentorship).then(
    (mentorship) => {
      res.send(mentorship);
    }
  );
};

export const getMentorshipHandler = (
  req: GetMentorshipsRequest,
  res: GetMentorshipsResponse
) => {
  const { user } = req.query;
  const userId = mongoose.Types.ObjectId(user._id);
  return MentorshipService.getCurrentMentorships(userId).then((mentorships) => {
    res.send(mentorships);
  });
};
