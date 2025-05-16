// import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ViewExams from "./pages/admin/viewExams";
import EditExams from "./pages/admin/editExams";
import AddPricePlan from "./pages/admin/pricePlans";
import ViewPricePlans from "./pages/admin/viewPricePlans";
import AdminDashboard from "./pages/admin/dashboard";
// import UsersList from "./pages/admin/users";
import StudentDetails from "./pages/admin/studentDetails";
import ScheduleExams from "./pages/admin/admin";
import AdvertisementPage from "./pages/admin/advertisementPage";
import VideosPage from "./pages/admin/videosPage";
import Login from "./pages/admin/login";
import Signup from "./pages/admin/signup";
import UserListPage from "./pages/admin/users";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {/* <Toaster /> */}
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/viewExams" element={<ViewExams />} />
          <Route path="/editExams" element={<EditExams />} />
          <Route path="/addPricePlans" element={<AddPricePlan />} />
          <Route path="/viewPricePlans" element={<ViewPricePlans />} />
          <Route path="/userslist" element={<UserListPage/>} />
          <Route path="/studentDetails/:id" element={<StudentDetails />} />
          <Route path="/scheduleExams" element={<ScheduleExams />} />
          <Route path="/advertisements" element={<AdvertisementPage />} />
          <Route path="/addvideos" element={<VideosPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
