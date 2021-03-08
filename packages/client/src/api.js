// Set of API endpoints available to all pages. This should make the get, post, update, and delete
// requests necessary.
// TODO: Handle profile pictures and set them as the avatar.
import { post, get } from "./utilities.js";
import { Auth } from "./providers/FirebaseProvider/index.js";

const Roles = {
  MENTOR: "MENTOR",
  PARENT: "PARENT",
};

const throwIfNotLoggedIn = () => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
};
const host = window.location.origin + "/";

export const getMentor = async () => await getUser(Roles.MENTOR);

export const getParent = async () => await getUser(Roles.PARENT);

export const createParentWithEmail = async (email, password, parent) => {
  return await createUserWithEmail(email, password, parent, Roles.PARENT);
};

export const createMentorWithEmail = async (email, password, mentor) => {
  return await createUserWithEmail(email, password, mentor, Roles.MENTOR);
};

export const getUser = async () => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  const token = await Auth.currentUser.getIdToken();
  return await post(host + "login", { token }).then((resp) => {
    // johanc - This is a hotfix.
    const { user } = resp;
    if (user === undefined || user.type === undefined) {
      return Promise.reject("Invalid user data retrieved from server.");
    }
    // This is a hotfix for the response schema: { user: { type: 'PARENT', user: IParent }}
    const data = user.user;
    data.role = user.type;
    return data;
  });
};

const createUserWithEmail = async (email, password, data, role) => {
  let token = undefined;
  try {
    await Auth.createUserWithEmailAndPassword(email, password);
    token = await Auth.currentUser.getIdToken();

    if (role === Roles.MENTOR) {
      await post(host + "users/mentor", {
        mentor: {
          ...data,
          // TODO: johanc - Validation should not happen here. This is a hot fix.
          gradeLevels: Object.keys(data.gradeLevels).map(
            (k) => data.gradeLevels[k]
          ),
          subjects: Object.keys(data.subjects).map((k) => data.subjects[k]),
        },
        token,
      });
    } else if (role === Roles.PARENT) {
      await post(host + "users/parent", { parent: data, token });
    } else {
      throw new Error("Unexpected user type");
    }
    await Auth.currentUser.sendEmailVerification();
    return { success: true, message: "User Created Successfully." };
  } catch (err) {
    if (token) await Auth.currentUser.delete();
    return { success: false, message: err };
  }
};

/**
 * Note: Assumes that the parent is the one requesting a mentorship.
 */
export const sendRequest = async (parentID, mentorID, studentID, message) => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  return await post(host + "mentorships/request", {
    message: message,
    parentID: parentID,
    studentID: studentID,
    mentorID: mentorID,
  });
};

// Can only be called by the mentor
export const acceptRequest = async (mentorship) => {
  throwIfNotLoggedIn();
  const body = { mentorship };
  return await post(host + "mentorships/accept", body);
};

// can only be called by the mentor
export const rejectRequest = async (mentorship) => {
  throwIfNotLoggedIn();
  const body = { mentorship };
  return await post(host + "mentorships/reject", body);
};

// To be called when the mentorship has ended.
export const archiveRequest = async (mentorship) => {
  throwIfNotLoggedIn();
  const body = { mentorship };
  return await post(host + "mentorships/archive", body);
};

export const saveProfileData = async (uid, data) => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  // TODO: Not implemented yet.
  var res = await post(host + `users/updateProfile/${uid}`, {
    update: JSON.stringify(data),
  });
  return res;
};

export const getRequests = async (requestState) => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  const token = await Auth.currentUser.getIdToken();
  return await get(host + "mentorships", { token }).then((mentorships) =>
    mentorships.filter((mentorship) => requestState === undefined || mentorship.state === requestState)
  );
};
/**
 * Mentorship must be the same mentorship object given from the server:
 * {
 *   mentor: $MENTOR_UID
 *   parent: $PARENT_UID
 *   student: $STUDENT_UID
 *   _id : $MENTORSHIP_UID
 * }
 *
 * Session is the new session you want to add to the mentorship object.
 * {
 *  date: Date,
 *  durationMinutes: Number,
 *  rating: Number
 * }
 * @param {Object} mentorship
 * @param {Number} hours
 */
export const addSession = async (mentorship, session) => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  return await post(host + "request/session", { mentorship, session });
};

export const updateRatingss = async (messageID, ratings, studentName) => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  throw Error("Not implemented yet.");
  // const token = await Auth.currentUser.getIdToken();
  // return await post(
  //   host + "request/updateRatings",
  //   {
  //     mentorUID: Auth.currentUser.uid,
  //     messageID: messageID,
  //     ratings: ratings,
  //     studentName: studentName,
  //   },
  //   { token }
  // );
};

export const getSpeakerSeriesList = async () => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Unable to retrieve user data with uninitilized Auth user.");
  }
  return await get(host + "speakerSeries");
};

export const getTeamDataList = async () => {
  return await get(host + "ourTeam");
};

export const getAlgoliaCredentials = async () => {
  if (Auth.currentUser === undefined || Auth.currentUser === null) {
    throw Error("Cannot retrieve algolia credentials when logged out. ");
  }
  return await get(host + "algolia/credentials");
};
