import { Request, Response } from "express";
import { IMentorship } from "../../models/Mentorships";
import { IMentor } from "../../models/Mentors";
import { IParent } from "../../models/Parents";
import { IStudent } from "../../models/Students";
import { ISession } from "../../models/Sessions";
export interface PostReqRequest extends Request {
  body: {
    mentor: IMentor;
    parent: IParent;
    student: IStudent;
    message: string;
  };
}

export interface PostReqResponse extends Response {}

// Only requiring the _id field because of https://stackoverflow.com/questions/37006008/typescript-index-signature-is-missing-in-type
// Express is not able to convert values in queries a non-primitive type, so we cannot use any interfaces that require ObjectId for example.
export interface GetMentorshipsRequest extends Request {
  query: { user: { _id: string } };
}

export interface GetMentorshipsResponse extends Response<IMentorship[]> {}

export interface PostAcceptMentorshipRequest extends Request {
  body: { mentorship: IMentorship };
  
}

export interface PostAcceptMentorshipResponse extends Response {}

export interface PostRejectMentorshipRequest extends Request {
  body: { mentor: IMentor; mentorship: IMentorship };
}

export interface PostRejectMentorshipResponse extends Response {}

export interface PostArchiveMentorshipRequest extends Request {
  body: { mentor: IMentor; mentorship: IMentorship };
}

export interface PostArchiveMentorshipResponse extends Response {}

export interface PostSessionRequest extends Request {
  body: { session: ISession; mentorship: IMentorship };
}

export interface PostSessionResponse extends Response {}
