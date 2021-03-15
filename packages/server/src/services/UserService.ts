import { mongoose } from "@typegoose/typegoose";
import algoliasearch, { SearchIndex } from "algoliasearch";
import ParentModel, { IParent } from "../models/Parents";
import MentorModel, { IMentor } from "../models/Mentors";
import StudentModel from "../models/Students";

// For some reason, mongoose-algolia does not update with algolia properly

class UserService {
  private mentorIndex: SearchIndex;
  constructor() {
    const { ALGOLIA_API_KEY, ALGOLIA_APP_ID } = process.env;
    if (ALGOLIA_API_KEY === undefined || ALGOLIA_APP_ID === undefined) {
      throw new Error("Unable connect to algolia.");
    }
    this.mentorIndex = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY).initIndex(
      "mentors"
    );
  }

  createMentor(mentor: IMentor): Promise<IMentor> {
    return this.userExists(mentor).then((exists) => {
      if (exists) {
        return Promise.reject(
          `Mentor ${mentor.name} with email ${mentor.email} already exists.`
        );
      }
      return MentorModel.create(mentor);
    });
  }

  private userExists(user: IMentor | IParent) {
    return MentorModel.find({ email: user.email })
      .then((docs) => {
        const mentorExists = docs.length > 0;
        return mentorExists;
      })
      .then((mentorExists) => {
        if (mentorExists) {
          return Promise.resolve(mentorExists);
        } else {
          return ParentModel.find({ email: user.email }).then(
            (docs) => docs.length > 0
          );
        }
      });
  }

  findMentor(_id: mongoose.Types.ObjectId): Promise<IMentor> {
    return MentorModel.findOne({ _id }).then((resp) => {
      return resp as IMentor;
    });
  }

  deleteMentor(_id: mongoose.Types.ObjectId): Promise<boolean> {
    return MentorModel.findOne({ _id })
      .then((doc) => {
        if (doc !== null) {
          try {
            // Sketchy but works: https://www.npmjs.com/package/mongoose-algolia
            // The plugin doesn't support TS so we have to do this sketchy thing.
            doc["RemoveFromAlgolia"]();
          } catch {
            console.log("Failed to remove document from algolia.");
          }
        }
      })
      .then(() => {
        return MentorModel.deleteOne({ _id }).then((res) => {
          return res.deletedCount !== undefined && res.deletedCount === 1;
        });
      });
  }

  updateMentor(
    _id: mongoose.Types.ObjectId,
    updatedMentor: IMentor
  ): Promise<boolean> {
    return MentorModel.findOne({ _id }).then((doc) => {
      if (doc === null) {
        return Promise.reject(`Unknown _id ${_id}`);
      }
      const update = {
        ...updatedMentor,
        // These fields should never be changed.
        _id: doc._id,
        firebaseUID: doc.firebaseUID,
      };
      return MentorModel.updateOne({ _id }, update).then(async (doc) => {
        if (doc !== null) {
          // This save operation is *NOT* partial. You need to send all the data to Algolia or
          // else the entry will be blank.
          return this.mentorIndex
            .saveObject({
              ...update,
              objectID: String(_id) || _id.toHexString(),
            })
            .then((resp) => {
              return doc !== null;
            })
            .catch((err) => {
              return false;
            });
        }
        return false;
      });
    });
  }

  createParent(parent: IParent): Promise<IParent> {
    return this.userExists(parent)
      .then((exists) => {
        if (exists) {
          return Promise.reject(
            `Parent ${parent.name} with email ${parent.email} already exists.`
          );
        }
        return ParentModel.create(parent);
      })
      .then(async (parent) => {
        const students = await Promise.all(
          parent.students.map((s) => StudentModel.create(s))
        );
        parent.students = students;
        await parent.save();
        return parent as IParent;
      });
  }

  findParent(_id: mongoose.Types.ObjectId): Promise<IParent> {
    return ParentModel.findOne({ _id }).then((resp) => {
      return resp as IParent;
    });
  }

  updateParent(
    _id: mongoose.Types.ObjectId,
    updatedParent: IParent
  ): Promise<boolean> {
    return ParentModel.findOne({ _id }).then((doc) => {
      if (doc === null) {
        return Promise.reject(`Unknown _id ${_id}`);
      }
      const update = {
        ...updatedParent,
        // These fields should never be changed.
        _id: doc._id,
        firebaseUID: doc.firebaseUID,
      };
      return ParentModel.updateOne({ _id }, update).then((doc) => {
        return doc !== null;
      });
    });
  }

  deleteParent(_id: mongoose.Types.ObjectId): Promise<boolean> {
    // Make sure to cleanup refs
    return ParentModel.findOne({ _id })
      .then((parent) => parent?.students)
      .then((students) => {
        if (students) {
          return Promise.all(
            students.map((s) => {
              return StudentModel.deleteOne({ _id: s._id });
            })
          );
        }
        return [];
      })
      .then(() =>
        ParentModel.deleteOne({ _id }).then((res) => {
          return res.deletedCount !== undefined && res.deletedCount === 1;
        })
      );
  }
}

export default new UserService();
