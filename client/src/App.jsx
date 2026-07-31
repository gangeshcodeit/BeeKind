import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Splash from "./pages/Splash.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Scenes from "./pages/Scenes.jsx";
import BeeChat from "./pages/BeeChat.jsx";
import Tasks from "./pages/Tasks.jsx";
import Weather from "./pages/Weather.jsx";
import Quiz from "./pages/Quiz.jsx";
import MyForest3D from "./pages/MyForest3D.jsx";
import TeacherDashboard from "./pages/TeacherDashboard.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) {
    return <p className="p-6 text-slate-400">Loading…</p>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function TeacherRoute({ children }) {
  const { token, user, loading } = useAuth();
  if (loading) {
    return <p className="p-6 text-slate-400">Loading…</p>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role !== "teacher") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

function StudentRoute({ children }) {
  const { token, user, loading } = useAuth();
  if (loading) {
    return <p className="p-6 text-slate-400">Loading…</p>;
  }
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (user?.role === "teacher") {
    return <Navigate to="/teacher-dashboard" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route
          path="/dashboard"
          element={
            <StudentRoute>
              <Dashboard />
            </StudentRoute>
          }
        />
        <Route
          path="/scenes"
          element={
            <StudentRoute>
              <Scenes />
            </StudentRoute>
          }
        />
        <Route
          path="/scenes/:sceneId"
          element={
            <StudentRoute>
              <Navigate to="/scenes" replace />
            </StudentRoute>
          }
        />
        <Route path="/scene" element={<Navigate to="/scenes" replace />} />
        <Route path="/scene/:sceneId" element={<Navigate to="/scenes" replace />} />
        <Route
          path="/bee"
          element={
            <StudentRoute>
              <BeeChat />
            </StudentRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <StudentRoute>
              <Tasks />
            </StudentRoute>
          }
        />
        <Route
          path="/weather"
          element={
            <StudentRoute>
              <Weather />
            </StudentRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <StudentRoute>
              <Quiz />
            </StudentRoute>
          }
        />
        <Route
          path="/forest-3d"
          element={
            <StudentRoute>
              <MyForest3D />
            </StudentRoute>
          }
        />
        <Route
          path="/teacher-dashboard"
          element={
            <TeacherRoute>
              <TeacherDashboard />
            </TeacherRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
