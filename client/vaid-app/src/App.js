import "./App.css";
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"; // Updated import
import HomePage from "./components/Home";
import AboutPage from "./components/About";
import Layout from "./components/Layout";
import LoginPage from "./components/Login";
import RegisterPage from "./components/Register";
import ForgotPasswordPage from "./components/ForgotPassword";
import ResetPasswordPage from "./components/ResetPassword";

import PrivateRoute from "./components/PrivateRoute";
import Dashboard from "./components/Dashboard";

import HospitalSearch from "./components/searchHospitals";
import MedicalRequest from "./components/MedicalRequest";
import HospitalList from "./components/HospitalList";

import ChildRegistration from "./components/childRegistration";

import Feedback from "./components/Feedback";

// Admin
import ManageRequests from "./components/AdminManageRequests";
import FeedbackView from "./components/AdminViewFeedback";
import ManageChildren from "./components/AdminManageChildren";
import SearchHistory from "./components/searchHistory";

// Error Boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error:", error);
    console.error("Info:", info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  return (
    <Router>
      <Layout>
        <ErrorBoundary>
          {" "}
          {/* Wrapping routes with Error Boundary */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            <Route
              path="/search-hospitals"
              element={
                <PrivateRoute>
                  <HospitalSearch />
                </PrivateRoute>
              }
            />

            <Route
              path="/medical-request"
              element={
                <PrivateRoute>
                  <MedicalRequest />
                </PrivateRoute>
              }
            />

            <Route
              path="/hospital-list"
              element={
                <PrivateRoute>
                  <HospitalList />
                </PrivateRoute>
              }
            />

            <Route
              path="/feedback"
              element={
                <PrivateRoute>
                  <Feedback />
                </PrivateRoute>
              }
            />

            <Route
              path="/child-registration"
              element={
                <PrivateRoute>
                  <ChildRegistration />
                </PrivateRoute>
              }
            />

            <Route
              path="/search-history"
              element={
                <PrivateRoute>
                  <SearchHistory />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/manage-requests"
              element={
                <PrivateRoute>
                  <ManageRequests />
                </PrivateRoute>
              }
            />

            <Route
              path="/viewFeedback"
              element={
                <PrivateRoute>
                  <FeedbackView />
                </PrivateRoute>
              }
            />

            <Route
              path="/manage-children"
              element={
                <PrivateRoute>
                  <ManageChildren />
                </PrivateRoute>
              }
            />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
}

export default App;
