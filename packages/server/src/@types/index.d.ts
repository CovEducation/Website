import { auth } from "firebase-admin";

declare global {
  namespace Express {
    interface Request {
      decodedToken: auth.DecodedIdToken;
    }
  }
}
