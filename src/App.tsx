import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage } from "./components/AuthPage";
import { Dashboard } from "./components/Dashboard";
import { useUser } from "@openfort/react";

function App() {
  const { user } = useUser();

  console.log("App - User state:", {
    user,
    userExists: !!user,
    userId: user?.id,
    route: window.location.pathname
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          user ? <Navigate to="/dashboard" replace /> : <AuthPage />
        } />
        <Route path="/dashboard" element={
          user ? <Dashboard /> : <Navigate to="/" replace />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
