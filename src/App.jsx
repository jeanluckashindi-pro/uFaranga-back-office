import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import AllModulesLayout from './components/AllModulesLayout';
import ProtectedRoute from './components/ProtectedRoute';
import DefaultRedirect from './components/DefaultRedirect';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Profile from './pages/Profile';

// Agent Pages
import AgentDashboard from './pages/agent/AgentDashboard';
import AgentTransactions from './pages/agent/Transactions';
import AgentFloat from './pages/agent/Float';
import AgentRapports from './pages/agent/Rapports';
import AgentCommissions from './pages/agent/Commissions';
import AgentNotifications from './pages/agent/Notifications';

// Admin System Pages
import AdminDashboard from './pages/admin/DashboardPro';
import CartographieReseau from './pages/admin/CartographieReseau';
import CouvertureMondiale from './pages/admin/CouvertureMondiale';
import GestionPays from './pages/admin/GestionPays';
import DetailsPays from './pages/admin/DetailsPays';
import CarteMondiale from './pages/admin/CarteMondiale';
import CartographieCouverture from './pages/admin/CartographieCouverture';
import GestionAgents from './pages/admin/GestionAgents';
import GestionClients from './pages/admin/GestionClients';
import ToutesTransactions from './pages/admin/ToutesTransactions';
import FloatGlobal from './pages/admin/FloatGlobal';
import Securite from './pages/admin/Securite';
import Fraude from './pages/admin/Fraude';
import Reporting from './pages/admin/Reporting';
import ParametresSysteme from './pages/admin/ParametresSysteme';
import ParametresSecurite from './pages/admin/parametres/Securite';
import GestionCommissions from './pages/admin/GestionCommissions';
import GestionProfils from './pages/admin/GestionProfils';
import CartographieUtilisateurs from './pages/admin/CartographieUtilisateurs';

// Tech Pages
import CartographieAgents from './pages/tech/CartographieAgents';
import TechMonitoring from './pages/tech/Monitoring';
import TechPerformance from './pages/tech/Performance';
import TechAPI from './pages/tech/API';
import TechWebhooks from './pages/tech/Webhooks';
import TechSMS from './pages/tech/SMS';
import TechEmail from './pages/tech/Email';
import TechLogs from './pages/tech/Logs';
import TechMaintenance from './pages/tech/Maintenance';
import TechFirewall from './pages/tech/Firewall';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              {/* Routes d'authentification (non protégées) */}
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Routes protégées */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <AllModulesLayout userName="Super Admin">
                    <Routes>
                      {/* Agent Routes */}
                      <Route path="/agent/dashboard" element={<ProtectedRoute module="agent"><AgentDashboard /></ProtectedRoute>} />
                      <Route path="/agent/transactions" element={<ProtectedRoute module="agent"><AgentTransactions /></ProtectedRoute>} />
                      <Route path="/agent/float" element={<ProtectedRoute module="agent"><AgentFloat /></ProtectedRoute>} />
                      <Route path="/agent/rapports" element={<ProtectedRoute module="agent"><AgentRapports /></ProtectedRoute>} />
                      <Route path="/agent/commissions" element={<ProtectedRoute module="agent"><AgentCommissions /></ProtectedRoute>} />
                      <Route path="/agent/notifications" element={<ProtectedRoute module="agent"><AgentNotifications /></ProtectedRoute>} />

                      {/* Profile Route - Accessible à tous */}
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Profile />} />

                      {/* Admin System Routes */}
                      <Route path="/admin/dashboard" element={<ProtectedRoute module="admin_system"><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/admin/cartographie" element={<ProtectedRoute module="admin_system"><CartographieReseau /></ProtectedRoute>} />
                      <Route path="/admin/couverture-mondiale" element={<ProtectedRoute module="admin_system"><CouvertureMondiale /></ProtectedRoute>} />
                      <Route path="/admin/gestion-pays" element={<ProtectedRoute module="admin_system"><GestionPays /></ProtectedRoute>} />
                      <Route path="/admin/pays/:id" element={<ProtectedRoute module="admin_system"><DetailsPays /></ProtectedRoute>} />
                      <Route path="/admin/carte-mondiale" element={<ProtectedRoute module="admin_system"><CarteMondiale /></ProtectedRoute>} />
                      <Route path="/admin/cartographie-couverture" element={<ProtectedRoute module="admin_system"><CartographieCouverture /></ProtectedRoute>} />
                      <Route path="/admin/agents" element={<ProtectedRoute module="admin_system"><GestionAgents /></ProtectedRoute>} />
                      <Route path="/admin/clients" element={<ProtectedRoute module="admin_system"><GestionClients /></ProtectedRoute>} />
                      <Route path="/admin/profils" element={<ProtectedRoute module="admin_system"><GestionProfils /></ProtectedRoute>} />
                      <Route path="/admin/cartographie-utilisateurs" element={<ProtectedRoute module="admin_system"><CartographieUtilisateurs /></ProtectedRoute>} />
                      <Route path="/admin/transactions" element={<ProtectedRoute module="admin_system"><ToutesTransactions /></ProtectedRoute>} />
                      <Route path="/admin/commissions" element={<ProtectedRoute module="admin_system"><GestionCommissions /></ProtectedRoute>} />
                      <Route path="/admin/float-global" element={<ProtectedRoute module="admin_system"><FloatGlobal /></ProtectedRoute>} />
                      <Route path="/admin/reporting" element={<ProtectedRoute module="admin_system"><Reporting /></ProtectedRoute>} />
                      <Route path="/admin/fraude" element={<ProtectedRoute module="admin_system"><Fraude /></ProtectedRoute>} />
                      <Route path="/admin/securite" element={<ProtectedRoute module="admin_system"><Securite /></ProtectedRoute>} />
                      <Route path="/admin/parametres" element={<ProtectedRoute module="admin_system"><ParametresSysteme /></ProtectedRoute>} />
                      <Route path="/admin/parametres/securite" element={<ProtectedRoute module="admin_system"><ParametresSecurite /></ProtectedRoute>} />

                      {/* Admin Tech Routes */}
                      <Route path="/tech/monitoring" element={<ProtectedRoute module="admin_tech"><TechMonitoring /></ProtectedRoute>} />
                      <Route path="/tech/cartographie-agents" element={<ProtectedRoute module="admin_tech"><CartographieAgents /></ProtectedRoute>} />
                      <Route path="/tech/performance" element={<ProtectedRoute module="admin_tech"><TechPerformance /></ProtectedRoute>} />
                      <Route path="/tech/api" element={<ProtectedRoute module="admin_tech"><TechAPI /></ProtectedRoute>} />
                      <Route path="/tech/webhooks" element={<ProtectedRoute module="admin_tech"><TechWebhooks /></ProtectedRoute>} />
                      <Route path="/tech/sms" element={<ProtectedRoute module="admin_tech"><TechSMS /></ProtectedRoute>} />
                      <Route path="/tech/email" element={<ProtectedRoute module="admin_tech"><TechEmail /></ProtectedRoute>} />
                      <Route path="/tech/logs" element={<ProtectedRoute module="admin_tech"><TechLogs /></ProtectedRoute>} />
                      <Route path="/tech/maintenance" element={<ProtectedRoute module="admin_tech"><TechMaintenance /></ProtectedRoute>} />
                      <Route path="/tech/firewall" element={<ProtectedRoute module="admin_tech"><TechFirewall /></ProtectedRoute>} />
                      <Route path="/tech/detection" element={<ProtectedRoute module="admin_tech"><AdminDashboard /></ProtectedRoute>} />
                      <Route path="/tech/database" element={<ProtectedRoute module="admin_tech"><AdminDashboard /></ProtectedRoute>} />

                      {/* Default redirect pour les utilisateurs connectés */}
                      <Route path="/" element={<DefaultRedirect />} />
                    </Routes>
                  </AllModulesLayout>
                </ProtectedRoute>
              } />
              
              {/* Redirection par défaut vers la page de connexion */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
