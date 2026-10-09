import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import ForgotPassword from './Pages/Auth/ForgotPassword';
import Studio from './studio/Studio';
import Welcome from './studio/pages/Welcome';
import useAuth from './hooks/useAuth';
import './studio/studio.css';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

function App() {
  const { user, loading, error, login, register, updateUser } = useAuth();
  if (loading) return <main className="session-loader" role="status"><span className="wordmark">nexo<span>estudio</span></span><p>Preparando tu espacio…</p></main>;
  return <BrowserRouter><ErrorBoundary>{error && <p className="auth-global-error" role="alert">{error}</p>}{user ? <Studio key={user.uid} user={user} setUser={updateUser} /> : <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login onLogin={login} />} />
    <Route path="/register" element={<Register onRegister={register} />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>}</ErrorBoundary></BrowserRouter>;
}
export default App;
