import { Request, Response } from "express";

export interface GetDoubleNumRequest extends Request {
  query: { num: number } & qs.ParsedQs;
}
export interface GetDoubleNumResponse extends Response<{ num: number }> {}

export interface PostNumRequest extends Request {
  body: { num: number };
}

export interface PostNumResponse extends Response<{ num: number }> {}
