import React, { useState, useEffect, useContext, createContext } from "react";

import { Auth } from "../FirebaseProvider";
import {
  getUser,
  createMentorWithEmail,
  createParentWithEmail,
  saveProfileData,
} from "../../api";
import "firebase/auth";
import "firebase/firestore";

export const AUTH_STATES = {
  LOGGED_OUT: "LOGGED_OUT",
  LOGGED_IN: "LOGGED_IN",
  UNINITIALIZED: "UNINITIALIZED",
  CREATING_USER: "CREATING_USER",
};

const authContext = createContext(null);

/**
 * AuthProvider class to inject the UserContext into child components
 */
const AuthProvider = ({ children, fallback }) => {
  const auth = useAuthProvider();

  // this renders the fallback component until firebase has initialized
  return (
    <authContext.Provider value={auth}>
      <authContext.Consumer>
        {(value) =>
          value.auth !== AUTH_STATES.UNINITIALIZED ? children : fallback
        }
      </authContext.Consumer>
    </authContext.Provider>
  );
};

const useAuth = () => {
  return useContext(authContext);
};

const useAuthProvider = () => {
  const [authState, setAuthState] = useState(AUTH_STATES.UNINITIALIZED);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [authErr, setAuthErr] = useState(null);

  /**
   * Signs a user in. This triggers pulling the correct user information.
   * @param {string} email
   * @param {string} password
   *
   * @return {Promise<firebase.auth.UserCredential>} the user credentials
   */
  const signin = (email, password) => {
    setAuthState(AUTH_STATES.LOGGED_IN);
    return Auth.signInWithEmailAndPassword(email, password)
    .catch((err) => {
      setAuthState(AUTH_STATES.LOGGED_OUT);
      throw err; // propagate error
    });
  };

  const signup = async (email, password, user) => {
    if (user.role !== "MENTOR" && user.role !== "PARENT") {
      throw Error(`Role invariant broken, unexpected role type: ${user.role}`);
    }
    setAuthState(AUTH_STATES.CREATING_USER);
    if (user.role === "MENTOR") {
      const res = await createMentorWithEmail(email, password, user);
      if (res.success) {
        setAuthState(AUTH_STATES.LOGGED_IN);
      }
      return res;
    } else {
      const res = await createParentWithEmail(email, password, user);
      if (res.success) {
        setAuthState(AUTH_STATES.LOGGED_IN);
      }
      return res;
    }
  };

  /**
   * Signs the current user out.
   */
  const signout = () => {
    Auth.signOut().then(() => {
      setUser(null);
      setAuthState(AUTH_STATES.LOGGED_OUT);
      window.location.href = window.location.origin;
    });
  };

  const saveProfileDetails = async (uid, data) => {
    await saveProfileData(uid, data)
      .then((data) => {
        alert("Profile was saved successfully.");
        setUser(data);
      })
      .catch((err) => {
        console.log(`Error saving profile: ${err}`);
      });
  };

  const setUserData = async (data) => {
    setUser(data);
  };

  // TODO this may have to be done synchronously
  // Register firebase state handler
  // Note that this only gets called once on mount
  useEffect(() => {
    const unsubscribe = Auth.onAuthStateChanged((auth) => {
      if (authState === AUTH_STATES.CREATING_USER) {
        // Avoids race-condition between firebase and firestore user creation.
      } else {
        if (auth != null) {
          setAuth(auth);
          setAuthState(AUTH_STATES.LOGGED_IN);
        } else {
          setAuthState(AUTH_STATES.LOGGED_OUT);
          setUser(null);
        }
      }
    });
    return unsubscribe;
  }, [authState]);

  // Attempt to fetch the user on update
  useEffect(() => {
    // Query for the user if not cached.
    if (user) {
      // no-op
    } else if (authState !== AUTH_STATES.LOGGED_IN) {
      setUser(null);
    } else {
      getUser()
        .then((user) => {
          setUser(user);
        })
        .catch((err) => {
          // if we fail to fetch user, log out
          setAuthErr("Unable to load user data");
          Auth.signOut()
            .then(() => {
              setAuthState(AUTH_STATES.LOGGED_OUT);
              setUser(null);
            })
            .catch((err2) => {
              setAuthState(AUTH_STATES.LOGGED_OUT);
              setUser(null);

            });

        });
    }
  }, [authState, user, auth]);

  return {
    auth,
    authState,
    authErr,
    user,
    signin,
    signup,
    signout,
    saveProfileDetails,
    setUserData,
  };
};

export { useAuth as default, AuthProvider };
