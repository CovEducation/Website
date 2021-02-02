import mongoose from "mongoose";
import { IMentor } from "../../models/Mentors";
import UserService from "../../services/UserService";
import {
  GetMentorRequest,
  PostMentorHandler,
  PostMentorResponse,
  GetMentorResponse,
  DeleteMentorRequest,
  DeleteMentorResponse,
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

export const deleteMentorHandler = (
  req: DeleteMentorRequest,
  res: DeleteMentorResponse
) => {
  UserService.deleteMentor(new mongoose.Types.ObjectId(req.body._id)).then(
    (ok) => {
      if (ok) {
        res.status(200).end();
      } else {
        res.status(400).end();
      }
    }
  );
};
