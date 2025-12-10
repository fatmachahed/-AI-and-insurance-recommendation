import logo from './logo.svg';
import './App.css';
import { LoginPage } from './pages/LoginPage/LoginPage.jsx';
import { Menu } from './components/Menu/Menu.jsx';
import { ClientsTable } from './pages/ClientsTable/ClientsTable.jsx';
import { Dashboard } from './pages/Dashboard/Dashboard.jsx';
import { ClientProfile } from './pages/ClientProfile/ClientProfile.jsx';
import { Chatbot } from './pages/Chatbot/Chatbot.jsx';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx'; // 🔹 importer ton composant

function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Menu />
      <main
        style={{
          flex: 1,
          padding: '20px',
          overflow: 'auto',
          backgroundColor: '#f8f9fa',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Routes privées */}
        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsTable />} />
            <Route
              path="/client-profile/:type/:id"
              element={<ClientProfile />}
            />
            <Route path="/chatbot" element={<Chatbot />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
