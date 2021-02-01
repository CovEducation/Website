import { Request, Response } from "express";
import { IMentor } from "src/models/Mentors";

export interface PostUserRequest extends Request {
  body: IMentor;
}

export interface PostUserResponse extends Response<IMentor> {}
