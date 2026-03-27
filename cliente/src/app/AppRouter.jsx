import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import HomePage from '../pages/HomePage';
import MusicPage from '../pages/MusicPage';
import GalleryPage from '../pages/GalleryPage';
import CommunityPage from '../pages/CommunityPage';
import ContactPage from '../pages/ContactPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ExclusivePage from '../pages/ExclusivePage';
import NotFoundPage from '../pages/NotFoundPage';

function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/musica" element={<MusicPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/comunidad" element={<CommunityPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route
          path="/exclusivo"
          element={
            <ProtectedRoute>
              <ExclusivePage />
            </ProtectedRoute>
          }
        />
        <Route path="/404" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default AppRouter;
