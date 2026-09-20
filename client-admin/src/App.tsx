import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./Auth/pages/Login";
import Dashboard from "./Dashboard/pages/Dashboard";
import Analytics from "./Analytics/pages/Analytics";
import Settings from "./Settings/pages/Settings";
import Projects from "./Projects/pages/Projects";
import Clients from "./Clients/pages/Clients";
import Payments from "./Payments/pages/Payments";
import Maintenance from "./Maintenance/pages/Maintenance";
import Documents from "./Documents/pages/Documents";
import Invoices from "./Invoices/pages/Invoices";
import Leads from "./Leads/pages/Leads";
import DraftEmail from "./Leads/pages/DraftEmail";
import DraftProposal from "./Leads/pages/DraftProposal";
import Reports from "./Reports/pages/Reports";
import Insights from "./Insights/pages/Insights";
import SuccessStories from "./SuccessStories/pages/SuccessStories";
import GrowthBlueprint from "./GrowthBlueprint/pages/GrowthBlueprint";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
      <Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
      <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><Documents /></ProtectedRoute>} />
      <Route path="/invoices" element={<ProtectedRoute><Invoices /></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><Leads /></ProtectedRoute>} />
      <Route path="/leads/:leadId/email" element={<ProtectedRoute><DraftEmail /></ProtectedRoute>} />
      <Route path="/leads/:leadId/proposal" element={<ProtectedRoute><DraftProposal /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
      <Route path="/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
      <Route path="/growth-blueprint" element={<ProtectedRoute><GrowthBlueprint /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
