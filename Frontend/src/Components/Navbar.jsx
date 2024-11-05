import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import baseAxios from '../Config/jwtInterceptor';

export const Logo = () => {
   return (
      <svg xmlns="http://www.w3.org/2000/svg" height="28" width="23" viewBox="0 0 640 512">
         <path fill="#d41c1c" d="M0 488L0 171.3c0-26.2 15.9-49.7 40.2-59.4L308.1 4.8c7.6-3.1 16.1-3.1 23.8 0L599.8 111.9c24.3 9.7 40.2 33.3 40.2 59.4L640 488c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24l0-264c0-17.7-14.3-32-32-32l-384 0c-17.7 0-32 14.3-32 32l0 264c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24zm488 24l-336 0c-13.3 0-24-10.7-24-24l0-56 384 0 0 56c0 13.3-10.7 24-24 24zM128 400l0-64 384 0 0 64-384 0zm0-96l0-80 384 0 0 80-384 0z" />
      </svg>
   );
};

const UserNavbar = () => {

   const navigate = useNavigate();
   const logout = async () => {
      try {
         await baseAxios.get("/logout");
         localStorage.removeItem("userAuth")
         localStorage.removeItem("customers")
         localStorage.removeItem("inventoryStocks")
         localStorage.removeItem("salesData")
         navigate("/login")
      } catch (error) {
         toast.error("Something wrong please try again later.");
      };
   };

   const confirmLogoutToast = () => {
      toast.dismiss();
      toast.custom(
         () => (
            <div className="bg-dark p-3" style={{ borderRadius: 20 }}>
               <h6 className="text-light">Do you want to logout from <b>StockMate</b>?</h6>
               <div className="d-flex justify-content-end gap-2 mt-3">
                  <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss()}>Cancel</button>
                  <button className="btn btn-sm btn-danger" onClick={() => { logout(); toast.dismiss() }}>Logout</button>
               </div>
            </div>
         ),
         { duration: Infinity }
      );
   };

   return (
      <Navbar expand="lg" className="px-5 py-3" style={{ borderBottom: "1px solid red" }}>
         <Container fluid>
            <Navbar.Brand className='d-flex gap-1 align-items-center'><Logo /><span className='mt-1'><b className='text-dark'>StockMate</b></span></Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
               <Nav className="me-auto my-2 my-lg-0" navbarScroll>
                  <Nav.Link onClick={() => navigate("/inventory")}>Inventory</Nav.Link>
                  <Nav.Link onClick={() => navigate("/customer")}>Customer</Nav.Link>
                  <Nav.Link onClick={() => navigate("/sales")}>Sales</Nav.Link>
               </Nav>
               <NavDropdown title={<FaUserCircle size={30} />} align="end" >
                  <NavDropdown.Item>About us</NavDropdown.Item>
                  <NavDropdown.Item>Contact</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={confirmLogoutToast}>Logout</NavDropdown.Item>
               </NavDropdown>
            </Navbar.Collapse>
         </Container>
      </Navbar>
   );
}

export default UserNavbar;