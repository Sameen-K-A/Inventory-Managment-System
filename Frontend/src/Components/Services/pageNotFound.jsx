import { useNavigate } from "react-router-dom";
import image from "../../../public/noData.jpg";

const PageNotFound = () => {
   const navigate = useNavigate();

   return (
      <div className="d-flex flex-column justify-content-center align-items-center text-center mx-auto" style={{ height: "100vh" }}>
         <img src={image} alt="No Data" className="img-fluid mb-3" style={{ maxWidth: '300px' }} />
         <h1>404</h1>
         <p>OOPS! Page not found</p>
         <button onClick={() => navigate(-1)} className="btn btn-dark mt-3">Go Back</button>
      </div>
   );
};

export default PageNotFound;