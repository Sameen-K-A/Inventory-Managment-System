import { useEffect, useState, useRef } from 'react';
import NoDataFound from './NoDataFound';
import SalesModal from './Modals/SalesModal';
import ShareModal from './Modals/ShareModal';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import baseAxios from '../../Config/jwtInterceptor';
import UserNavbar from './Navbar';

const Sales = () => {
   const [showModal, setShowModal] = useState(false);
   const [showShareModal, setShowShareModal] = useState(false);
   const [sales, setSales] = useState([]);
   const navigate = useNavigate();
   const tableRef = useRef();

   useEffect(() => {
      (async () => {
         try {
            const response = await baseAxios.get("/sales");
            setSales(response.data.sales);
         } catch (error) {
            handleError(error);
         }
      })();
   }, []);

   const handleError = (error) => {
      if (error.response.status === 401) {
         navigate("/login", {
            state: { message: "Authentication failed, Please login." },
         });
      } else if (error.response.status === 400) {
         toast.error("Failed to update resource.");
      } else {
         console.error(error);
         toast.error("Something went wrong, please try again later.");
      }
      setShowModal(false);
   };

   return (
      <>
         <UserNavbar />
         <div className="container mt-5">
            <div className="row">
               <div className="col">
                  <h4 className="text-left"><b>Sales</b></h4>
               </div>
               <div className="col-auto d-flex gap-2">
                  <button className="btn btn-warning" onClick={() => setShowShareModal(true)}>Share</button>
                  <button className="btn btn-dark" onClick={() => setShowModal(true)}>Add new sale</button>
               </div>
            </div>
            {sales.length > 0 ? (
               <table ref={tableRef} className="table table-bordered mt-5 text-center">
                  <thead>
                     <tr className="table-header">
                        <th scope="col">SL</th>
                        <th scope="col">Product name</th>
                        <th scope="col">Customer name</th>
                        <th scope="col">Time & Date</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Total amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     {sales.map((data, index) => (
                        <tr key={data.id} style={{ verticalAlign: "middle" }}>
                           <td>{index + 1}</td>
                           <td>{data.productName}</td>
                           <td>{data.customerName}</td>
                           <td>{data.date}</td>
                           <td>{data.quantity}</td>
                           <td>{data.price}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            ) : (
               <div className="mt-5"><NoDataFound /></div>
            )}
            {showModal && (
               <SalesModal setShowModal={setShowModal} handleError={handleError} setSales={setSales} />
            )}
            {showShareModal && (
               <ShareModal setShowShareModal={setShowShareModal} tableRef={tableRef} />
            )}
         </div>
      </>
   );
};

export default Sales;