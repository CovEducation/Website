import { Router } from "express";
// import algolia, { SearchClient } from "algoliasearch";
import UserRouter from "./users/UserRouter";
import MentorshipRouter from "./mentorship/MentorshipRouter";
import { ensureLoggedIn, login, logout } from "../middleware/auth";
import findUp from "find-up";
import dotenv from "dotenv";

dotenv.config({ path: findUp.sync(".env") });
const { ALGOLIA_API_KEY, ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY } = process.env;
if (
  ALGOLIA_API_KEY === undefined ||
  ALGOLIA_APP_ID === undefined ||
  ALGOLIA_SEARCH_API_KEY === undefined
) {
  throw new Error(
    `Error initializing Mentor model, missing Algolia credentials.`
  );
}
class MainRouter {
  private _router = Router();
  private _userSubRouter = UserRouter;
  private _mentorshipSubRouter = MentorshipRouter;
  // private _algoliaClient: SearchClient;
  constructor() {
    this.configure();
  }

  get router() {
    return this._router;
  }

  private configure() {
    // this._algoliaClient = algolia(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

    this.configureAuthRoutes();
    this.configurePublicRoutes();
  }

  private configureAuthRoutes() {
    // TODO(johancc) - Restructure after launch.

    this.router.get("/algolia/credentials", ensureLoggedIn, (_, res) => {
      res.send({ key: ALGOLIA_SEARCH_API_KEY, appID: ALGOLIA_APP_ID });
      // this._algoliaClient
      //   .addApiKey(["search"], {
      //     validity: 30 * 60, // 30 mins per session.
      //     indexes: ["mentors"],
      //     description: "Ephemeral API token for parents.",
      //   })
      //   .then(({ key }) => {
      //     res.send({ key, appId: ALGOLIA_APP_ID });
      //   });
    });
  }

  private configurePublicRoutes() {
    this.router.get("/heartbeat", (_, res) => res.send({ msg: "alive" }));
    this.router.post("/login", login);
    this.router.post("/logout", logout);
    this.router.use("/users", this._userSubRouter);
    this.router.use("/mentorships", this._mentorshipSubRouter);
  }
}

export default new MainRouter().router;
