import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Studio, { Welcome } from './studio/Studio';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';

function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nexo:user')) || null; }
    catch { return null; }
  });
  function updateUser(next) {
    const valid = next && typeof next.email === 'string' ? next : null;
    try { if (valid) localStorage.setItem('nexo:user', JSON.stringify(valid)); else localStorage.removeItem('nexo:user'); }
    catch { /* La sesión de prueba puede mantenerse en memoria. */ }
    setUser(valid);
  }
  return <BrowserRouter><ErrorBoundary>{user ? <Studio user={user} setUser={updateUser} /> : <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login setUser={updateUser} />} />
    <Route path="/register" element={<Register setUser={updateUser} />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>}</ErrorBoundary></BrowserRouter>;
}
export default App;
