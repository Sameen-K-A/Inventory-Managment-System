import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useState } from "react";

const Signup = () => {

   const navigate = useNavigate();
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");

   const handleRegistration = async (event) => {
      event.preventDefault();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const nameRegex = /^[A-Za-z\s]{3,15}$/;
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

      if (!name.trim().match(nameRegex)) {
         toast.error("Name must be between 3 and 15 characters and contain only letters and spaces.");
         return;
      }

      if (!email.trim().match(emailRegex)) {
         toast.error("Please enter a valid email address.");
         return;
      }

      if (!password.trim().match(passwordRegex)) {
         toast.error("Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number.");
         return;
      }

      try {
         await axios.post(`${import.meta.env.VITE_BASEURL}/register`, {
            name: name.trim(),
            email: email.trim(),
            password: password.trim(),
         });
         navigate("/login", { state: { message: "Registration complete successfully." } });
      } catch (error) {
         if (error.response?.status === 409) {
            toast.error("Email already exists.");
         } else {
            console.log(error);
            toast.error("Something went wrong, please try again later.");
         }
      }
   };

   return (
      <div className="wrapper signUp">
         <div className="form">
            <div className="heading">SIGNUP</div>

            <label htmlFor="name">Name</label>
            <input type="text" autoComplete="name" className="red_input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />

            <label htmlFor="name">E-Mail</label>
            <input type="text" autoComplete="email" className="red_input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

            <label htmlFor="password">Password</label>
            <input type="password" className="red_input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />

            <button type="submit" onClick={(e) => handleRegistration(e)}>Submit</button>
            <p>
               Have an account ? <u onClick={() => navigate("/login")}> Login </u>
            </p>
         </div>
      </div>
   );
};

export default Signup;