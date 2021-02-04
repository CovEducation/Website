import { mongoose } from "@typegoose/typegoose";
import ParentModel, { IParent } from "../models/Parents";
import MentorModel, { IMentor } from "../models/Mentors";
import StudentModel from "../models/Students";

class UserService {
  createMentor(mentor: IMentor): Promise<IMentor> {
    return MentorModel.create(mentor);
  }

  findMentor(_id: mongoose.Types.ObjectId): Promise<IMentor> {
    return MentorModel.findOne({ _id }).then((resp) => {
      return resp as IMentor;
    });
  }

  deleteMentor(_id: mongoose.Types.ObjectId): Promise<boolean> {
    return MentorModel.deleteOne({ _id }).then((res) => {
      return res.deletedCount !== undefined && res.deletedCount === 1;
    });
  }

  createParent(parent: IParent): Promise<IParent> {
    return ParentModel.create(parent).then(async (parent) => {
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
