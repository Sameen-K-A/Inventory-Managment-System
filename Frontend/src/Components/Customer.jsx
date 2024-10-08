import React, { useEffect, useState } from "react";
import CustomerModal from './Modals/CustomerModal';
import baseAxios from "../../Config/jwtInterceptor";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UserNavbar from "./Navbar";
import NoDataFound from "./NoDataFound";
import 'bootstrap/dist/css/bootstrap.min.css';

const Customer = () => {

  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const localStorageData = localStorage.getItem("customers");
        if (localStorageData) {
          setCustomers(JSON.parse(localStorageData));
        } else {
          const response = await baseAxios.get("/customer")
          setCustomers(response.data?.customers);
          localStorage.setItem("customers", JSON.stringify(response.data.customers));
        }
      } catch (error) {
        handleError(error);
      };
    })();
  }, []);

  const confirmDeleteToast = (customerId) => {
    toast.dismiss();
    toast.custom(
      () => (
        <div className="bg-dark p-3" style={{ borderRadius: 20 }}>
          <h6 className="text-light">Are you sure you want to delete this customer?</h6>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss()}>Cancel</button>
            <button className="btn btn-sm btn-danger" onClick={() => { handleDeleteCustomer(customerId); toast.dismiss() }}>
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const handleDeleteCustomer = async (customerId) => {
    try {
      await baseAxios.delete("/customer", { data: { customerId: customerId } });
      const afterDelete = customers.filter((customer) => customer.id !== customerId)
      setCustomers(afterDelete);
      localStorage.setItem("customers", JSON.stringify(afterDelete));
      toast.success("Customer deleted successfully.");
    } catch (error) {
      handleError(error);
    };
  };

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
    };
    setShowModal(false);
  };

  return (
    <>
      <UserNavbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <h4 className="text-left"><b>My Customers</b></h4>
          </div>
          <div className="col-auto">
            <button className="btn btn-dark" onClick={() => setShowModal(true)}>Add new Customer</button>
          </div>
        </div>
        {customers.length > 0 ? (
          <table className="table table-bordered mt-5 text-center">
            <thead>
              <tr className="table-header">
                <th scope="col">SL</th>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Mobile</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id} style={{ verticalAlign: "middle" }}>
                  <td>{index + 1}</td>
                  <td>{customer.customerName}</td>
                  <td>{customer.customerAddress}</td>
                  <td>{customer.customerPhone}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => confirmDeleteToast(customer.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="mt-5"><NoDataFound /></div>
        )}
        {showModal && (
          <CustomerModal setShowModal={setShowModal} customers={customers} setCustomers={setCustomers} handleError={handleError} />
        )}
      </div>
    </>
  );
};

export default Customer;