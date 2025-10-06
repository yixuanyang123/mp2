import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { MealsProvider } from './context/MealsContext';
import ListView from './pages/ListView';
import GalleryView from './pages/GalleryView';
import DetailView from './pages/DetailView';

function App() {
  return (
    <MealsProvider>
  <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div className="App-root">
          <header className="App-header">
            <div className="brand">
              <div className="logo">🍽️</div>
              <div className="title-small">DishBook</div>
            </div>
            <nav className="App-nav">
              <Link to="/">List</Link>
              <Link to="/gallery">Gallery</Link>
            </nav>
          </header>

          {/* Use a small inner component so we can call the location hook and toggle a class on <main> */}
          <MainRoutes />
        </div>
      </BrowserRouter>
    </MealsProvider>
  );
}

export default App;

function MainRoutes() {
  const location = useLocation();
  const isList = location.pathname === '/' || location.pathname === '';
  return (
    <main className={`App-main ${isList ? 'list-mode' : ''}`}>
      <Routes>
        <Route path="/" element={<ListView />} />
        <Route path="/gallery" element={<GalleryView />} />
        <Route path="/meal/:id" element={<DetailView />} />
      </Routes>
    </main>
  );
}
