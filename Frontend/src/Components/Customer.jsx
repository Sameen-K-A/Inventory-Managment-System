import React, { useState } from "react";
import CustomerModal from './CustomerModal';

const Customer = () => {
   const [customers, setCustomers] = useState([
      { id: 1, name: "John Doe", address: "123 Main St", mobile: "123-456-7890" },
      { id: 2, name: "Jane Smith", address: "456 Elm St", mobile: "987-654-3210" },
   ]);

   const [showModal, setShowModal] = useState(false);

   return (
      <>
         <div className="container mt-5">
            <div className="row">
               <div className="col">
                  <h4 className="text-left"><b>My Customers</b></h4>
               </div>
               <div className="col-auto">
                  <button className="btn btn-danger" onClick={() => setShowModal(true)}>Add new Customer</button>
               </div>
            </div>
            <table className="table table-bordered mt-5 text-center">
               <thead>
                  <tr className="table-header">
                     <th scope="col">ID</th>
                     <th scope="col">Name</th>
                     <th scope="col">Address</th>
                     <th scope="col">Mobile</th>
                  </tr>
               </thead>
               <tbody>
                  {customers.map((customer) => (
                     <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>{customer.name}</td>
                        <td>{customer.address}</td>
                        <td>{customer.mobile}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
            {showModal && (
               <CustomerModal setShowModal={setShowModal} />
            )}
         </div>
      </>
   );
}

export default Customer;