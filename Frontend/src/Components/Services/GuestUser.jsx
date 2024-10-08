import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

function GuestUser({ children }) {

   const navigate = useNavigate();
   let userAuth = localStorage.getItem("userAuth");
   if (userAuth) {
      userAuth = JSON.parse(userAuth);
   };

   useEffect(() => {
      if (userAuth) {
         navigate("/inventory", { replace: true });
      }
   }, []);

   if (!userAuth) {
      return children
   }
}

export default GuestUser;