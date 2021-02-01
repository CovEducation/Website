import { mongoose } from "@typegoose/typegoose";
import MentorModel, { IMentor, Mentor } from "../models/Mentors";

class UserService {
  createMentor(mentor: IMentor): Promise<Mentor> {
    return MentorModel.create(mentor);
  }

  deleteMentor(_id: mongoose.Types.ObjectId): Promise<boolean> {
    return MentorModel.deleteOne({ _id }).then((res) => {
      return res.deletedCount !== undefined && res.deletedCount === 1;
    });
  }
}

export default new UserService();
