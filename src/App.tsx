import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login/login";
import Register from "./Register/page";
import Events from "./Event/page";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/events" element={<Events />} />
    </Routes>
  );
}
