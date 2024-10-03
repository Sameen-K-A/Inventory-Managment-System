import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Home from "./Components/Home";
import Inventory from "./Components/Inventory";
import Customer from "./Components/Customer";
import Navbar from "./Components/Navbar";
import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "sonner";

import "../public/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const location = useLocation();

  return (
    <>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customer" element={<Customer />} />
      </Routes>
      <Toaster richColors closeButton toastOptions={{ style: { padding: '18px', borderRadius: '8px' } }} />
    </>
  );

};

export default App;