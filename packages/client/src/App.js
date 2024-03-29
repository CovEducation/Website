import React, { Suspense } from "react";
import {
  BrowserRouter as Router, Switch, Route
} from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/Dashboard";
import HomePage from "./pages/Home";
import FAQsPage from "./pages/FAQs";
import ProfilePage from "./pages/Profile";
import SignUpPage from "./components/SignUp2";
import MeetOurTeam from "./pages/MeetOurTeam";
import NavBar from "./components/NavBar";
import ContactUsPage from "./pages/ContactUs";
import SignInPage from "./pages/SignIn";
import RequestsPage from "./pages/Requests";
import PasswordReset from "./pages/PasswordReset";
import ResourcesPage from "./pages/Resources";
import ProgramPage from "./pages/Programs";
import PressRelease from "./pages/PressRelease";

import { AuthProvider } from "./providers/AuthProvider";
import SpeakerSeriesPage from "./pages/SpeakerSeries";

function App() {
  return (
    <Suspense fallback={<></>}>
      <AuthProvider fallback="loading">
          <Router>
          <PressRelease/>
          <NavBar />
            <Switch>
              <Route path="/" exact>
                <HomePage />
              </Route>
              <Route path="/press-release">
                <PressRelease/>
              </Route>
              <Route path="/profile">
                <ProfilePage />
              </Route>
              <Route path="/speaker-series">
                <SpeakerSeriesPage/>
              </Route>
              <Route path="/programs">
                <ProgramPage />
              </Route>
              <Route path="/requests">
                <RequestsPage/>
              </Route>
              <Route path="/contactus">
                <ContactUsPage />
              </Route>
              <Route path="/resources">
                <ResourcesPage />
              </Route>
              <Route path="/faqs">
                <FAQsPage />
              </Route>
              <Route path="/dashboard">
                <DashboardPage />
              </Route>
              <Route path="/signup">
                <SignUpPage />
              </Route>
              <Route path="/team">
                <MeetOurTeam/>
              </Route>
              <Route path="/signin">
                <SignInPage/>
              </Route>
              <Route path="/forgot-password">
                <PasswordReset />
              </Route>
            </Switch>
          </Router>
        </AuthProvider>
    </Suspense>
  );
}

export default App;
