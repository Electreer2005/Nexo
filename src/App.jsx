import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';

// Componentes
import Header from './Components/Header/Header';
import Sidebar from './Components/Sidebar/Sidebar';
import RouteFallback from './Components/RouteFallback/RouteFallback';
import ErrorBoundary from './Components/ErrorBoundary/ErrorBoundary';
import useLocalStorage from './hooks/useLocalStorage';

// Pantallas — lazy
const Welcome = lazy(() => import('./Pages/Welcome/Welcome'));
const Login = lazy(() => import('./Pages/Auth/Login'));
const Register = lazy(() => import('./Pages/Auth/Register'));
const Dashboard = lazy(() => import('./Pages/Dashboard/Dashboard'));
const MisAlbumes = lazy(() => import('./Pages/MisAlbumes/MisAlbumes'));
const Favoritos = lazy(() => import('./Pages/Favoritos/Favoritos'));
const Explorar = lazy(() => import('./Pages/Explorar/Explorar'));
const AlbumDetail = lazy(() => import('./Pages/AlbumDetail/AlbumDetail'));


import './App.css';

/* ============================================================
   Rutas autenticadas — array para escalar fácil
   ============================================================ */
const PRIVATE_ROUTES = [
  { path: '/', element: Dashboard, title: 'Inicio' },
  { path: '/mis-albumes', element: MisAlbumes, title: 'Mis Albumes' },
  { path: '/favoritos', element: Favoritos, title: 'Mis Favoritos' },
  { path: '/explorar', element: Explorar, title: 'Explorar' },
  { path: '/album/:id', element: AlbumDetail, title: 'Álbum' },
];

/* ============================================================
   Placeholder mientras carga la ruta
   ============================================================ */
function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__spinner" aria-hidden="true" />
      <span className="page-loader__text">Cargando…</span>
    </div>
  );
}

/* ============================================================
   App sin autenticar
   ============================================================ */
function UnAuthenticateApp({ setUser }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/forgot-password" element={<div className="placeholder-page">Recuperar contraseña</div>} />
          <Route path="/reset-password" element={<div className="placeholder-page">Resetear contraseña</div>} />
          <Route path="*" element={<Welcome />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

/* ============================================================
   Wrapper que reinicia la animación en cada cambio de ruta
   ============================================================ */
function AnimatedOutlet({ children }) {
  const location = useLocation();

  return (
    <div
      key={location.pathname}
      className="app__route animate-fade-up"
    >
      {children}
    </div>
  );
}

/* ============================================================
   AppContent — layout autenticado
   ============================================================ */
function AppContent({ user, setUser }) {
  const isDesktop =
    typeof window !== 'undefined' &&
    window.matchMedia('(min-width: 769px)').matches;

  const [sidebarOpen, setSidebarOpen] = useLocalStorage(
    'nexo:sidebar',
    isDesktop
  );
  const menuButtonRef = useRef(null);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((open) => !open);
  }, []);

  /* Bloquear scroll del body cuando el sidebar está abierto en mobile */
  useEffect(() => {
    if (!sidebarOpen) return;
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    if (!isMobile) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [sidebarOpen]);

  return (
    <div
      className={`app ${sidebarOpen ? 'app--sidebar-open' : 'app--sidebar-closed'}`}
    >
      <Header
        user={user}
        setUser={setUser}
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
        menuButtonRef={menuButtonRef}
      />

      <div className="app__body">
        <Sidebar open={sidebarOpen} onClose={closeSidebar} />

        <main
          className={`app__main ${sidebarOpen ? 'app__main--with-sidebar' : ''}`}
          id="main-content"
        >
          <AnimatedOutlet>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                {PRIVATE_ROUTES.map(({ path, element: Element }) => (
                  <Route
                    key={path}
                    path={path}
                    element={<Element setUser={setUser} />}
                  />
                ))}
              </Routes>
            </Suspense>
          </AnimatedOutlet>
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   App raíz
   ============================================================ */
function App() {
  const [user, setUser] = useLocalStorage('nexo:user', null);

  return (
    <Router>
      {user ? (
        <AppContent user={user} setUser={setUser} />
      ) : (
        <UnAuthenticateApp setUser={setUser} />
      )}
    </Router>
  );
}

export default App;