import { IncomingHttpHeaders } from "http";

declare module "express-serve-static-core" {
  interface Request {
    headers: { token: string } & IncomingHttpHeaders;
  }
}
