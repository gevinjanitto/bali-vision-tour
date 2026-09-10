import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { DataProvider, useData } from './context/DataContext';
import { Navbar, MobileNav } from './components/Navbar';
import { Footer } from './components/Layout';
import { SmoothScroll } from './components/SmoothScroll';
import { Preloader } from './components/Preloader';
import Home from './pages/Home';
import TourPackages from './pages/TourPackages';
import TourDetail from './pages/TourDetail';
import CarRental from './pages/CarRental';
import CarDetail from './pages/CarDetail';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import About from './pages/About';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import ResourcePage from './admin/ResourcePage';
import Bookings from './admin/Bookings';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const PublicLayout = () => {
  const { loading } = useData();
  return (
    <div className="min-h-screen flex flex-col pb-[66px] md:pb-0">
      <SmoothScroll />
      <Preloader loading={loading} />
      <Navbar />
      <main className="flex-1">{!loading && <Outlet />}</main>
      <Footer />
      <MobileNav />
    </div>
  );
};

const RequireAuth = () => {
  const { auth } = useData();
  if (!auth.isAuthed) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
};

function App() {
  return (
    <div className="App">
      <DataProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tour-packages" element={<TourPackages />} />
              <Route path="/tour-packages/:slug" element={<TourDetail />} />
              <Route path="/car-rental" element={<CarRental />} />
              <Route path="/car-rental/:slug" element={<CarDetail />} />
              <Route path="/activities" element={<Activities />} />
              <Route path="/activities/:slug" element={<ActivityDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/articles" element={<Articles />} />
              <Route path="/articles/:slug" element={<ArticleDetail />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<RequireAuth />}>
              <Route index element={<Dashboard />} />
              <Route path="tours" element={<ResourcePage key="tours" resource="tours" />} />
              <Route path="cars" element={<ResourcePage key="cars" resource="cars" />} />
              <Route path="activities" element={<ResourcePage key="activities" resource="activities" />} />
              <Route path="articles" element={<ResourcePage key="articles" resource="articles" />} />
              <Route path="bookings" element={<Bookings />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
      </DataProvider>
    </div>
  );
}

export default App;
