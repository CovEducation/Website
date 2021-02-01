import { IMentor } from "src/models/Mentors";
import UserService from "src/services/UserService";
import { PostUserRequest, PostUserResponse } from "./interfaces";

export const postUserHandler = (
  req: PostUserRequest,
  res: PostUserResponse
) => {
  const mentor: IMentor = req.body;
  UserService.createMentor(mentor).then((newMentor) => res.send(newMentor));
};
