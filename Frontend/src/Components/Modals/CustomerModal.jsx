import React, { useState } from 'react';
import baseAxios from '../../Config/jwtInterceptor';
import { toast } from 'sonner';

const CustomerModal = ({ setShowModal, customers, setCustomers, handleError }) => {

  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!customerName.trim()) {
      toast.error("Customer name is required.");
      return;
    };
    if (!/^[A-Za-z\s]+$/.test(customerName.trim())) {
      toast.error("Customer name can only contain alphabets and spaces.");
      return;
    };
    if (!customerAddress.trim()) {
      toast.error("Customer address is required.");
      return;
    };
    if (!customerPhone.trim()) {
      toast.error("Customer phone number is required.");
      return;
    };
    if (!/^[6-9]\d{9}$/.test(customerPhone.trim())) {
      toast.error("Please enter a valid phone number.");
      return;
    };
    const isPhoneUnique = customers.some((customer) => customer?.customerPhone === customerPhone.trim());
    if (isPhoneUnique) {
      toast.error("This phone number already exists.");
      return;
    };

    setIsLoading(true);
    try {
      const response = await baseAxios.post("/customer", {
        customerName: customerName.trim(),
        customerAddress: customerAddress.trim(),
        customerPhone: customerPhone.trim()
      });
      const afterCreate = [...customers, response.data];
      setCustomers(afterCreate);
      localStorage.setItem("customers", JSON.stringify(afterCreate));
      setShowModal(false);
      toast.success("Customer added successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body p-4">
              <h5 className="modal-title mt-2 mb-4 text-center">Add New Customer</h5>

              <div className="mb-3">
                <label htmlFor="customerName" className="form-label">Customer Name</label>
                <input type="text" className="form-control" id="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
              </div>

              <div className="mb-3">
                <label htmlFor="customerAddress" className="form-label">Address</label>
                <textarea type="text" style={{ maxHeight: "150px", minHeight: "80px" }} className="form-control" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
              </div>

              <div className="mb-3">
                <label htmlFor="customerPhone" className="form-label">Mobile Number</label>
                <input type="text" className="form-control" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-dark" onClick={handleSave} disabled={isLoading} >
                  {isLoading ? 'Loading...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerModal;