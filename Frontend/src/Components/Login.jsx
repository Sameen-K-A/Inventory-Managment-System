import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Login = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (location.state?.message === "Registration complete successfully.") {
      toast.success("Registration complete successfully.");
    } else if (location.state?.message === "Authentication failed, Please login.") {
      toast.error("Authentication failed, Please login.");
    };
  }, [location.state]);

  const handleLogin = async (event) => {
    event.preventDefault();
    const data = {
      email: email,
      password: password,
    };
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BASEURL}/login`, data, { withCredentials: true });
      localStorage.setItem("userAuth", JSON.stringify(true));
      navigate("/inventory");
    } catch (error) {
      if (error.response.status === 404) {
        toast.error("Email is not found.");
      } else if (error.response.status === 401) {
        toast.error("Password is wrong.");
      } else {
        toast.error("Something wrong please try again later.");
        console.log("Error from login page", error);
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper signIn">
      <div className="form">
        <div className="heading">LOGIN</div>
        <form>

          <label>E-Mail</label>
          <input type="email" autoComplete="email" className="red_input" placeholder="Enter you email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" className="red_input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button type="submit" onClick={(e) => handleLogin(e)} disabled={isLoading}>{isLoading ? "Loading..." : "Login"}</button>

        </form>
        <p>Don't have an account ? <u onClick={() => navigate("/signup")}> Sign Up </u></p>
      </div>
    </div>
  );
};

export default Login;