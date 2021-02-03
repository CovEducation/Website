import mongoose from "mongoose";
import { IMentor } from "../../models/Mentors";
import { IParent } from "../../models/Parents";
import UserService from "../../services/UserService";
import {
  GetMentorRequest,
  PostMentorRequest,
  PostMentorResponse,
  GetMentorResponse,
  DeleteMentorRequest,
  DeleteMentorResponse,
  PostParentResponse,
  PostParentRequest,
  GetParentRequest,
  GetParentResponse,
  DeleteParentRequest,
  DeleteParentResponse,
} from "./interfaces";

export const postMentorHandler = (
  req: PostMentorRequest,
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
        res.status(404).end();
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
        res.status(404).end();
      }
    }
  );
};

export const postParentHandler = (
  req: PostParentRequest,
  res: PostParentResponse
) => {
  const parent: IParent = req.body;
  UserService.createParent(parent)
    .then((newParent) => res.send(newParent))
    .catch(() => {
      res.status(500).end();
    });
};

export const getParentHandler = (
  req: GetParentRequest,
  res: GetParentResponse
) => {
  UserService.findParent(new mongoose.Types.ObjectId(req.query._id))
    .then((parent) => {
      if (parent === null) {
        res.status(404).end();
      } else {
        res.send(parent as IParent);
      }
    })
    .catch(() => {
      res.status(500).end();
    });
};

export const deleteParentHandler = (
  req: DeleteParentRequest,
  res: DeleteParentResponse
) => {
  UserService.deleteParent(new mongoose.Types.ObjectId(req.body._id)).then(
    (ok) => {
      if (ok) {
        res.status(200).end();
      } else {
        res.status(404).end();
      }
    }
  );
};
