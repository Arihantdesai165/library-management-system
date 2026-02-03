import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Books from "./pages/Books";
import Admin from "./pages/Admin";
import MyBorrows from "./pages/MyBorrows";
import Register from "./pages/Register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/books" element={<Books />} />
        <Route path="/my-borrows" element={<MyBorrows />} />
        <Route path="/admin" element={<Admin />} />   {/* ✅ REQUIRED */}
      </Routes>
    </BrowserRouter>
  );
}
