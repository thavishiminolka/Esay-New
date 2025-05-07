// import Home from "./pages/Home/Home";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/Login/Login";
// import SignupPage from "./pages/Signup/Signup";
// import Contact from "./pages/Contact/Contact";
// import Pricing from "./pages/Pricing/Pricing";
// import Dashboard from "./pages/Student/dashboard";
// import ExamsPage from "./pages/Student/exams";
// import LeaderboardPage from "./pages/Student/leaderboard";
// import VideosPage from "./pages/Student/videos";
// import GuidelinesPage from "./pages/Student/guidline";
// import ProfilePage from "./pages/Student/profile";
// import EditProfilePage from "./pages/Student/editprofile";
// import MyResultsPage from "./pages/Student/resultview";
// import NotificationsPage from "./pages/Student/notification";
// import ExamPage from "./pages/Student/ExamPage";
// import EmailVerify from "./Auth/EmailVerify";
// import ResetPassword from "./Auth/ResetPassword";
// import UserList from "./Auth/userActivation";
// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/login" element={<LoginPage />} />
//         <Route path="/signup" element={<SignupPage />} />
//         <Route path="/email-verify"element={<EmailVerify/>}/>
//         <Route path="/reset-password" element={<ResetPassword/>} />
//         <Route path="/userActivation" element={<UserList/>} />
//         <Route path="/contact" element={<Contact />} />
//         <Route path="/pricing" element={<Pricing />} />
//         <Route path="/dashboard" element={<Dashboard/>} />
//           <Route path="/exams" element={<ExamsPage/>} />
//           <Route path="/leaderboard" element={<LeaderboardPage/>} />
//           <Route path="/videos" element={<VideosPage/>} />
//           <Route path="/guidelines/:id" element={<GuidelinesPage/>} />
//           <Route path="/profile" element={<ProfilePage/>} />
//           <Route path="/editprofile" element={<EditProfilePage/>} />
//           <Route path="/myresult" element={<MyResultsPage/>} />
//           <Route path="/notification" element={<NotificationsPage/>} />
//           <Route path="/quiz/:id" element={<ExamPage/>} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

//updated

import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/Login";
import SignupPage from "./pages/Signup/Signup";
import Contact from "./pages/Contact/Contact";
import Pricing from "./pages/Pricing/Pricing";
import Dashboard from "./pages/Student/dashboard";
import ExamsPage from "./pages/Student/exams";
import LeaderboardPage from "./pages/Student/leaderboard";
import VideosPage from "./pages/Student/videos";
import GuidelinesPage from "./pages/Student/guidline";
import ProfilePage from "./pages/Student/profile";
import EditProfilePage from "./pages/Student/editprofile";
import MyResultsPage from "./pages/Student/resultview";
import NotificationsPage from "./pages/Student/notification";
import ExamPage from "./pages/Student/ExamPage";
import EmailVerify from "./Auth/EmailVerify";
import ResetPassword from "./Auth/ResetPassword";
import UserList from "./Auth/userActivation";
import { ExamProvider } from "../contexts/ExamContext";
import PrivacyPolicy from "./pages/Privacy Policy/PrivacyPolicy";
import TermsAndConditions from "./pages/Terms and Conditions/TermsAndConditions";
import RefundPolicy from "./pages/Refund Policy/RefundPolicy";

function App() {
  return (
    <ExamProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/email-verify" element={<EmailVerify />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/userActivation" element={<UserList />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/guidelines" element={<GuidelinesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/editprofile" element={<EditProfilePage />} />
          <Route path="/myresult" element={<MyResultsPage />} />
          <Route path="/notification" element={<NotificationsPage />} />
          <Route path="/quiz" element={<ExamPage />} />
          <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/termsAndConditions" element={<TermsAndConditions />} />
          <Route path="/refundPolicy" element={<RefundPolicy />} />
        </Routes>
      </BrowserRouter>
    </ExamProvider>
  );
}

export default App;
