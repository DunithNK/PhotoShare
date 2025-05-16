import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/user/HomePage.jsx";
import Login from "./pages/user/Login.jsx";
import Register from "./pages/user/Register.jsx";
import ProfilePage from "./pages/user/ProfilePage.jsx";
import ExplorePage from "./pages/user/ExplorePage.jsx";
import Navbar from "./components/navbar.jsx";
import CourseManagementPage from "./pages/user/CourseManagement.jsx";
import SkillSharePage from "./pages/user/SkillSharePage.jsx";
import AuthCallback from "./components/AuthCallBack.jsx";
import ProtectedRoute from "./components/ProtectedRoutes.jsx";
import CourseDetailPage from "./pages/user/CourseDetails.jsx";
import CourseAdmin from "./pages/admin/CourseAdminV1.jsx";
import CityArchitecturePage from "./pages/user/CityArchitecturePage.jsx";
import LandscapesPage from "./pages/user/LandscapesPage.jsx";
import AnimalPage from "./pages/user/AnimalPage.jsx";
import MacroPage from "./pages/user/MacroPage.jsx";
import NaturePage from "./pages/user/NaturePage.jsx";
import PeoplePage from "./pages/user/PeoplePage.jsx";
import PhotoCategoryPage from "./pages/user/PhotoCategoryPage.jsx";
import EventPhotoApp from "./pages/user/EventManagementPage.jsx";
import AdminDashboard from "./pages/admin/Admin.jsx";
import Layout from "./components/Layout.jsx";
import EventsPage from "./pages/admin/EventsPage.jsx";
import SkillsPage from "./pages/admin/SkillsPage.jsx";
import CoursesPage from "./pages/admin/CoursesPage.jsx";
import AddCourse from "./pages/admin/AddCourse.jsx";
import AddInstructor from "./pages/admin/AddInstructor.jsx";
import InstructorPage from "./pages/admin/InstructorPage.jsx";
import AddEvent from "./pages/admin/AddEvent.jsx";
import EventDetailsPage from "./pages/admin/EventDetails.jsx";
import OrganizersPage from "./pages/admin/OrganizersPage.jsx";
import AddOrganizer from "./pages/admin/AddOrganizer.jsx";
import InstructorDetails from "./pages/admin/InstructorDetails.jsx";
import ViewPost from "./pages/admin/ViewPost.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/explore" element={<ExplorePage />} />

        {/* Category Pages */}
        <Route
          path="/categories/city"
          element={<PhotoCategoryPage category="city" />}
        />
        <Route
          path="/categories/landscapes"
          element={<PhotoCategoryPage category="landscapes" />}
        />
        <Route
          path="/categories/nature"
          element={<PhotoCategoryPage category="nature" />}
        />
        <Route
          path="/categories/animal"
          element={<PhotoCategoryPage category="animal" />}
        />
        <Route
          path="/categories/people"
          element={<PhotoCategoryPage category="people" />}
        />
        <Route
          path="/categories/macro"
          element={<PhotoCategoryPage category="macro" />}
        />

        {/* Protected Routes */}
        <Route
          path="/course-management"
          element={
            <ProtectedRoute>
              <CourseManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skill-share"
          element={
            <ProtectedRoute>
              <SkillSharePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/course-details/:courseId"
          element={
            <ProtectedRoute>
              <CourseDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/event-management"
          element={
            <ProtectedRoute>
              <EventPhotoApp />
            </ProtectedRoute>
          }
        />

        <Route
          path="admin"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          

          <Route path="courses" element={<CoursesPage />}>
            <Route path="add-courses" element={<AddCourse />} />
            <Route
              path="course-details/:courseId"
              element={<CourseDetailPage />}
            />
            <Route path="edit-course/:courseId" element={<AddCourse />} />
          </Route>

          <Route path="instructors" element={<InstructorPage />}>
            <Route path="add-instructors" element={<AddInstructor />} />
            <Route
              path="instructor-details/:instructorId"
              element={<InstructorDetails />}
            />
            <Route
              path="edit-instructor/:instructorId"
              element={<AddInstructor />}
            />
          </Route>

          <Route path="events" element={<EventsPage />}>
            <Route path="add-events" element={<AddEvent />} />
            <Route
              path="event-details/:eventId"
              element={<EventDetailsPage />}
            />
            <Route path="edit-event/:eventId" element={<AddEvent />} />
          </Route>

          <Route path="organizers" element={<OrganizersPage />}>
            <Route path="add-organizer" element={<AddOrganizer />} />
            <Route
              path="edit-organizer/:organizerId"
              element={<AddOrganizer />}
            />
          </Route>

          <Route path="skills" element={<SkillsPage />}>
            <Route path="view-post/:postId" element={<ViewPost />} />
          </Route>
        </Route>

        {/* Callback Route */}
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
    </Router>
  );
}

export default App;
