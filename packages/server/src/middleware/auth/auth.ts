import { default as firebase } from "firebase-admin";
import { NextFunction, Request, Response } from "express";

import ParentModel, { IParent } from "../../models/Parents";
import MentorModel from "../../models/Mentors";
import StudentModel, { IStudent } from "../../models/Students";

const verify = (token: string) => {
  return firebase.auth().verifyIdToken(token);
};

const getUser = (user: firebase.auth.DecodedIdToken) => {
  return MentorModel.findOne({ firebaseUID: user.uid }).then((doc) => {
    if (doc === null) {
      return ParentModel.findOne({ firebaseUID: user.uid }).then(
        async (doc) => {
          if (doc === null) {
            return { user: null, type: null, userId: null };
          }
          const students = await Promise.all(
            doc.students.map((s) =>
              StudentModel.findOne({ _id: s._id }).then((d) => {
                if (d === null) {
                  return Promise.reject("Failed to retrieve students.");
                }
                return d as IStudent;
              })
            )
          );
          doc.students = students;
          return { user: doc as IParent, type: "PARENT", userId: doc?._id };
        }
      );
    }

    return { user: doc as any, type: "MENTOR", userId: doc._id };
  });
};

const getUserId = (user: firebase.auth.DecodedIdToken) => {
  return MentorModel.findOne({ firebaseUID: user.uid }).then((doc) => {
    if (doc === null) {
      return ParentModel.findOne({ firebaseUID: user.uid }).then((doc) => {
        return doc?._id;
      });
    } else {
      return doc._id;
    }
  });
};

// TODO(johancc) - For some reason, you cannot log in by sending the token in the header (it gets encoded as [object Object])
const login = (req: Request, res: Response) => {
  verify(req.headers.token || req.body.token || req.query.token)
    .then((user) => {
      if (user === undefined) {
        throw new Error("Invalid user.");
      }
      return getUser(user);
    })
    .then((user) => {
      if (user?.user === null || user?.userId === undefined) {
        throw new Error("Unable to retrieve user.");
      }
      req.session.userId = user.userId;
      res.send({ user });
    })
    .catch((err) => {
      res.status(401).send({ err });
    });
};

const logout = (req: Request, res: Response) => {
  if (req.session.userId === undefined) {
    res.status(400).send({ err: "Already logged out" });
  } else {
    req.session.userId = undefined;
    res.send({});
  }
};

const verifyFirebaseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  verify(req.headers.token || req.body.token)
    .then((user) => {
      if (user === undefined) {
        res.status(401).send({ err: "Not logged in." });
        return;
      }
      // johanc - req.body.decodedToken should only ever be accessed when creating accounts.
      req.body.decodedToken = user;
      next();
    })
    .catch(() => {
      res.status(401).send({ err: "Not logged in." });
    });
};

// SSY: we could change the verifyFirebaseToken and ensureLoggedIn middlewares
const ensureLoggedIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.session.userId !== undefined) {
    next();
  } else {
    verify(req.headers.token || req.body.token || req.query.token)
      .then((user) => {
        if (user === undefined) {
          res.status(401).send({ err: "Not logged in." });
          return;
        }
        return getUserId(user);
      })
      .then((id) => {
        if (id === undefined) {
          throw new Error("Unable to retrieve user.");
        }
        req.session.userId = id;
        next();
      })
      .catch(() => {
        res.status(401).send({ err: "Not logged in." });
      });
  }
};

export default {
  verifyFirebaseToken,
  ensureLoggedIn,
  login,
  logout,
};
