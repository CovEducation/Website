import { mongoose } from "@typegoose/typegoose";
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
}

export default new UserService();
