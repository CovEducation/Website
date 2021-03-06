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
  const mentor: IMentor = req.body.mentor;
  mentor.firebaseUID = req.body.decodedToken.uid;
  UserService.createMentor(mentor)
    .then((newMentor) => {
      req.session.userId = newMentor._id;
      res.send(newMentor);
    })
    .catch(() => {
      res.status(500).end();
    });
};

export const getMentorHandler = (
  req: GetMentorRequest,
  res: GetMentorResponse
) => {
  UserService.findMentor(mongoose.Types.ObjectId(req.query._id))
    .then((mentor) => {
      if (mentor === null) {
        res.status(404).end();
      } else {
        res.send(mentor);
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
  UserService.deleteMentor(
    mongoose.Types.ObjectId(String(req.session.userId))
  ).then((ok) => {
    req.session.userId = undefined;
    if (ok) {
      res.status(200).end();
    } else {
      res.status(400).end();
    }
  });
};

export const postParentHandler = (
  req: PostParentRequest,
  res: PostParentResponse
) => {
  const parent: IParent = req.body.parent;
  parent.firebaseUID = req.body.decodedToken.uid;
  UserService.createParent(parent)
    .then((newParent) => {
      req.session.userId = newParent._id;
      res.send(newParent);
    })
    .catch(() => {
      res.status(500).end();
    });
};

export const getParentHandler = (
  req: GetParentRequest,
  res: GetParentResponse
) => {
  UserService.findParent(mongoose.Types.ObjectId(req.query._id))
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
  UserService.deleteParent(
    mongoose.Types.ObjectId(String(req.session.userId))
  ).then((ok) => {
    if (ok) {
      req.session.userId = undefined;
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  });
};
