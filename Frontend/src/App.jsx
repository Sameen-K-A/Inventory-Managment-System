import Login from "./Components/Login";
import Signup from "./Components/Signup";
import Inventory from "./Components/Inventory";
import Customer from "./Components/Customer";
import Sales from "./Components/Sales";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import UserAuth from "./Components/Services/UserAuth";
import GuestUser from './Components/Services/GuestUser';
import PageNotFound from "./Components/Services/pageNotFound";

import "../public/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/inventory" replace />} />
        <Route path="/login" element={<GuestUser><Login /></GuestUser>} />
        <Route path="/signup" element={<GuestUser><Signup /></GuestUser>} />
        <Route path="/inventory" element={<UserAuth><Inventory /></UserAuth>} />
        <Route path="/customer" element={<UserAuth><Customer /></UserAuth>} />
        <Route path="/sales" element={<UserAuth><Sales /></UserAuth>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster richColors closeButton toastOptions={{ style: { padding: '18px', borderRadius: '8px' } }} />
    </>
  );
};

export default App;