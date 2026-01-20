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


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/theaters/:id" element={<TheaterDetails/>} />
        <Route path="/seat-layout" element={<SeatLayout />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/success" element={<Success />} />
        <Route path="/tickets" element={<Ticket />} />
        <Route path="/cancel" element={<Cancel />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
