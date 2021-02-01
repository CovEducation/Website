import {
  GetDoubleNumRequest,
  GetDoubleNumResponse,
  PostNumRequest,
  PostNumResponse,
} from "./interfaces";
import MainService from "../../services/MainService";

export const getDoubleNumHandler = (
  req: GetDoubleNumRequest,
  res: GetDoubleNumResponse
) => {
  const num = req.query.num;
  const doubledNum = MainService.doubleNum(num);
  res.send({ num: doubledNum });
};

export const postNumHandler = (req: PostNumRequest, res: PostNumResponse) => {
  const num = req.body.num;
  MainService.saveNum(num).then((numDoc) => {
    res.send({ num: numDoc.value });
  });
};
