import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetails from "./pages/MovieDetails";
import TestShowTimes from "./pages/TestShowTimes";
import TheaterDetails from "./pages/TheaterDetails";
import SeatLayout from "./pages/SeatLayout";
import BookingDetails from "./pages/BookingDetails";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Ticket from "./pages/Ticket";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/test-showtimes/:id" element={<TestShowTimes />} />
        <Route path="/theaters/:id" element={<TheaterDetails/>} />
        <Route path="/seat-layout" element={<SeatLayout />} />
        <Route path="/booking-details" element={<BookingDetails />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />
        <Route path="/tickets" element={<Ticket />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
