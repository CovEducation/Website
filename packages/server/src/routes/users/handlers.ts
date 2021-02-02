import mongoose from "mongoose";
import { IMentor } from "../../models/Mentors";
import UserService from "../../services/UserService";
import {
  GetMentorRequest,
  PostMentorHandler,
  PostMentorResponse,
  GetMentorResponse,
} from "./interfaces";

export const postMentorHandler = (
  req: PostMentorHandler,
  res: PostMentorResponse
) => {
  const mentor: IMentor = req.body;
  UserService.createMentor(mentor)
    .then((newMentor) => res.send(newMentor))
    .catch(() => {
      res.status(500).end();
    });
};

export const getMentorHandler = (
  req: GetMentorRequest,
  res: GetMentorResponse
) => {
  UserService.findMentor(new mongoose.Types.ObjectId(req.query._id))
    .then((mentor) => {
      if (mentor === null) {
        res.status(400).end();
      } else {
        res.send(mentor as IMentor);
      }
    })
    .catch(() => {
      res.status(500).end();
    });
};
