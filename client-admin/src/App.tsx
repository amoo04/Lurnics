import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Login from "./features/Auth/pages/Login";
import Dashboard from "./features/Dashboard/pages/Dashboard";
import Analytics from "./features/Analytics/pages/Analytics";
import Settings from "./features/Settings/pages/Settings";
import Projects from "./features/Projects/pages/Projects";
import Clients from "./features/Clients/pages/Clients";
import Payments from "./features/Payments/pages/Payments";
import Maintenance from "./features/Maintenance/pages/Maintenance";
import Documents from "./features/Documents/pages/Documents";
import Invoices from "./features/Invoices/pages/Invoices";
import Leads from "./features/Leads/pages/Leads";
import DraftEmail from "./features/Leads/pages/DraftEmail";
import DraftProposal from "./features/Leads/pages/DraftProposal";
import Messages from "./features/Messages/pages/Messages";
import Reports from "./features/Reports/pages/Reports";
import Insights from "./features/Insights/pages/Insights";

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
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
