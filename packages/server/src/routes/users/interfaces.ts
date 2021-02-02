import { Request, Response } from "express";
import { IMentor } from "src/models/Mentors";

export interface PostMentorHandler extends Request {
  body: IMentor;
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
