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
      try {
         await axios.post("http://localhost:3000/register", {
            name: name,
            email: email,
            password: password
         });
         navigate("/login", { state: { message: "Registration complete successfully." } });
      } catch (error) {
         if (error.response.status === 409) {
            toast.error("Email already exist");
         } else {
            console.log(error);
            toast.error("Something wrong please try again later.");
         };
      };
   };

   return (
      <div className="wrapper signUp">
         <div className="form">
            <div className="heading">SIGNUP</div>
            <form>

               <label htmlFor="name">Name</label>
               <input type="text" className="red_input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />

               <label htmlFor="name">E-Mail</label>
               <input type="text" className="red_input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />

               <label htmlFor="password">Password</label>
               <input type="password" className="red_input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter you password" />

               <button type="submit" onClick={(e) => handleRegistration(e)}>Submit</button>

            </form>
            <p>
               Have an account ? <u onClick={() => navigate("/login")}> Login </u>
            </p>
         </div>
      </div>
   );
};

export default Signup