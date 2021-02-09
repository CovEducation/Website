import { Request, Response } from "express";
import { IMentorship } from "../../models/Mentorships";
import { IMentor } from "../../models/Mentors";
import { IParent } from "../../models/Parents";
import { IStudent } from "../../models/Students";
import { ISession } from "src/models/Sessions";

export interface PostReqRequest extends Request {
  mentor: IMentor;
  parent: IParent;
  student: IStudent;
}

export interface PostReqResponse extends Response {}

export interface GetMentorshipsRequest extends Request {
  user: IMentor | IParent;
}

export interface GetMentorshipsResponse extends Response<IMentorship[]> {}

export interface PostAcceptMentorshipRequest extends Request {
  mentor: IMentor;
  mentorship: IMentorship;
}

export interface PostAcceptMentorshipResponse extends Response {}

export interface PostRejectMentorshipRequest extends Request {
  mentor: IMentor;
  mentorship: IMentorship;
}

export interface PostRejectMentorshipResponse extends Response {}

export interface PostArchiveMentorshipRequest extends Request {
  mentorship: IMentorship;
}

export interface PostArchiveMentorshipResponse extends Response {}

export interface PostSessionRequest extends Request {
  session: ISession;
  mentorship: IMentorship;
}

export interface PostSessionResponse extends Response {}
