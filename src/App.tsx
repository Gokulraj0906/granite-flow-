import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthPages from "./pages/Auth";
import TasksView from "./pages/TasksView";
import TeamView from "./pages/TeamView";
import CalendarView from "./pages/CalendarView";
import MembersView from "./pages/MembersView";
import AnalyticsView from "./pages/AnalyticsView";
import OrganizationSettingsView from "./pages/OrganizationSettingsView";
import OrganizationsView from "./pages/OrganizationsView";
import AllUsersView from "./pages/AllUsersView";
import HelpSupportView from "./pages/HelpSupportView";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksView />} />
        <Route path="/team" element={<TeamView />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/members" element={<MembersView />} />
        <Route path="/organizations" element={<OrganizationsView />} />
        <Route path="/all-users" element={<AllUsersView />} />
        <Route path="/analytics" element={<AnalyticsView />} />
        <Route path="/settings" element={<OrganizationSettingsView />} />
        <Route path="/help" element={<HelpSupportView />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/overview" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;