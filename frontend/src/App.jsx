import { useEffect, useState } from "react";
import "./App.css";
import { socket } from "./socket";
import { Navbar } from "./components/Navbar";
import BaseState from "./context/base/Basestate.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Messages from "./components/Messages";
import SignUpTenant from "./components/SignUpTenant";
import Login from "./components/Login.jsx";
import AddProperty from "./components/AddProperty.jsx";
import FindProperty from "./components/FindProperty.jsx";
import FindFlatmate from "./components/FindFlatmateComponents/FindFlatmate.jsx";
import OTPPageTenant from "./components/OTPPage/OTPPageTenant.jsx";
import OTPPageLandlord from "./components/OTPPage/OTPPageLandlord.jsx";
import TenantProfilePage from "./components/TenantProfilePage/TenantProfilePage.jsx";
import TenantEditPage from "./components/TenantProfilePage/TenantEditPage.jsx";
import BookmarkedFlatmates from "./components/BookmarkedFlatmates.jsx";
import SignupLandlord from "./components/SignupLandlord.jsx";
import FlatmateCardExpand from "./components/FlatmateCardExpand.jsx";
import ForgotPassword from "./components/ForgotPassword/ForgotPassword.jsx";
import SetNewPassword from "./components/ForgotPassword/SetNewPassword.jsx";
import OTPPageForgot from "./components/ForgotPassword/OTPPageForgot.jsx";
import OTPDeletePage from "./components/OTPPage/OTPDeletePage.jsx";
import HomePage from "./components/LandlordDashboard/HomePage.jsx";
import EditProperty from "./components/EditProperty.jsx";
import MessageStart from "./components/MessageStart.jsx";
import LandlordProfile from "./components/LandlordProfile/LandlordProfile.jsx";
import PropertyDisplay from "./components/PropertyDisplay.jsx";
import LandlordEditProfile from "./components/LandlordProfile/LandlordEditProfile.jsx";

function App() {
  const [id, setID] = useState("");

  return (
    <BaseState>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/messages" element={<MessageStart />} />
        <Route path="/signup-tenant" element={<SignUpTenant setID={setID} />} />
        <Route
          path="/signup-landlord"
          element={<SignupLandlord setID={setID} />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/find-property" element={<FindProperty />} />
        <Route path="/find-flatmate" element={<FindFlatmate />} />
        <Route path="/otp-page-tenant" element={<OTPPageTenant id={id} />} />
        <Route path="/otp-page-land" element={<OTPPageLandlord id={id} />} />
        <Route path="/tenant-profile-page" element={<TenantProfilePage />} />
        <Route path="/tenant-edit-page" element={<TenantEditPage />} />
        <Route path="/landlord-edit-page" element={<LandlordEditProfile />} />
        <Route path="/tenant-dashboard" element={<BookmarkedFlatmates />} />
        <Route path="/tenant/:id" element={<FlatmateCardExpand />} />
        <Route path="/landlord-dashboard" element={<HomePage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-forgot" element={<OTPPageForgot />} />
        <Route path="/edit-property/:id" element={<EditProperty />} />
        <Route path="/set-new-password" element={<SetNewPassword />} />
        <Route path="/otp-delete-page" element={<OTPDeletePage />} />
        <Route path="/landlord-profile-page" element={<LandlordProfile />} />
        <Route path="/chat/:id" element={<Messages />} />
        <Route path="/property/:id" element={<PropertyDisplay />} />
      </Routes>
    </BaseState>
  );
}

export default App;
