import { Request, Response } from "express";
import { IMentor } from "src/models/Mentors";
import { IParent } from "src/models/Parents";

export interface PostMentorRequest extends Request {
  body: { mentor: IMentor };
}

export interface PostMentorResponse extends Response<IMentor> {}

export interface GetMentorRequest extends Request {
  query: { _id: string };
}

export interface GetMentorResponse extends Response<IMentor> {}

export interface DeleteMentorRequest extends Request {
  body: { _id: string };
}

export interface DeleteMentorResponse extends Response {}

export interface PostParentRequest extends Request {
  body: { parent: IParent };
}

export interface PostParentResponse extends Response<IParent> {}

export interface GetParentRequest extends Request {
  query: { _id: string };
}

export interface GetParentResponse extends Response<IParent> {}

export interface DeleteParentRequest extends Request {
  body: { _id: string };
}

export interface DeleteParentResponse extends Response {}
