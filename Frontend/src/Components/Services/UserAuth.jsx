import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function UserAuth({ children }) {

   const navigate = useNavigate();
   let userAuth = localStorage.getItem("userAuth");
   if (userAuth) {
      userAuth = JSON.parse(userAuth);
   };

   useEffect(() => {
      if (!userAuth) {
         navigate("/login", { state: { message: "Authentication failed, Please login." } });
      }
   }, []);

   if (userAuth) {
      return children
   }
}

export default UserAuth;