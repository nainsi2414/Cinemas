import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import TheaterDetails from "./pages/TheaterDetails";
import SeatLayout from "./pages/SeatLayout";
import BookingDetails from "./pages/BookingDetails";
import Success from "./pages/Success";
import Ticket from "./pages/Ticket";
import Cancel from "./pages/Cancel";

import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />


        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Home />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MovieDetails />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route 
        path="/theaters/:id" 
        element={
        <ProtectedRoute>
          <MainLayout>
          <TheaterDetails/>
          </MainLayout>
        </ProtectedRoute>} />

        <Route path="/seat-layout" element={
          <ProtectedRoute>
            <SeatLayout />
          </ProtectedRoute>} />

        <Route path="/booking-details" element={
          <ProtectedRoute>
            <BookingDetails />
            </ProtectedRoute>} />

        <Route 
          path="/success" 
          element={
            <ProtectedRoute>
              <Success />
            </ProtectedRoute>
          } />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Ticket />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/cancel" 
          element={
            <ProtectedRoute>
              <Cancel />
            </ProtectedRoute>} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
