import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (location.state?.message === "Registration complete successfully.") {
      toast.success("Registration complete successfully.");
    }
  }, [location.state]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await axios.post("http://localhost:3000/login", {
        email: email,
        password: password
      });
      navigate("/");
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Email is not found.");
      } else if (error.response.status === 401) {
        toast.error("Password is wrong.");
      } else {
        toast.error("Something wrong please try again later.");
        console.log("Error from login page", error);
      };
    };
  };

  return (
    <div className="wrapper signIn">
      <div className="form">
        <div className="heading">LOGIN</div>
        <form>

          <label>E-Mail</label>
          <input type="email" className="red_input" placeholder="Enter you email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="text" className="red_input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" onClick={(e) => handleLogin(e)}>Submit</button>

        </form>
        <p>Don't have an account ? <u onClick={() => navigate("/signup")}> Sign In </u></p>
      </div>
    </div>
  );
};

export default Login;