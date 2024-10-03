import React from 'react';

const CustomerModal = ({ setShowModal }) => {
   return (
      <>
         <div className="modal-backdrop fade show" />
         <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
               <div className="modal-content">

                  <div className="modal-body p-4">
                     <h5 className="modal-title mt-2 mb-4 text-center">Add New Customer</h5>
                     <form>
                        <div className="mb-3">
                           <label htmlFor="customerName" className="form-label">Customer Name</label>
                           <input type="text" className="form-control" id="customerName" />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="customerAddress" className="form-label">Address</label>
                           <textarea type="text" style={{ maxHeight: "150px", minHeight: " 80px" }} className="form-control" id="customerAddress" />
                        </div>
                        <div className="mb-3">
                           <label htmlFor="customerMobile" className="form-label">Mobile Number</label>
                           <input type="text" className="form-control" id="customerMobile" />
                        </div>
                     </form>
                     <div className="d-flex justify-content-end gap-2">
                        <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)} >Close</button>
                        <button type="button" className="btn btn-dark">Save changes</button>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </>
   )
};

export default CustomerModal;