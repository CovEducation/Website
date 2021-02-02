import { mongoose } from "@typegoose/typegoose";
import ParentModel, { IParent, Parent } from "../models/Parents";
import MentorModel, { IMentor, Mentor } from "../models/Mentors";

class UserService {
  createMentor(mentor: IMentor): Promise<Mentor> {
    return MentorModel.create(mentor);
  }

  findMentor(_id: mongoose.Types.ObjectId) {
    return MentorModel.findOne({ _id });
  }

  deleteMentor(_id: mongoose.Types.ObjectId): Promise<boolean> {
    return MentorModel.deleteOne({ _id }).then((res) => {
      return res.deletedCount !== undefined && res.deletedCount === 1;
    });
  }

  createParent(parent: IParent): Promise<Parent> {
    return ParentModel.create(parent);
  }

  findParent(_id: mongoose.Types.ObjectId) {
    return ParentModel.findOne({ _id });
  }

  deleteParent(_id: mongoose.Types.ObjectId): Promise<boolean> {
    return ParentModel.deleteOne({ _id }).then((res) => {
      return res.deletedCount !== undefined && res.deletedCount === 1;
    });
  }
}

export default new UserService();
