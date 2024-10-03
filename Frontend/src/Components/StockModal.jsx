import { useState, useEffect } from 'react';
import { toast } from "sonner";
import axios from "axios";

const StockModal = ({ setShowModal, stock }) => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');

  useEffect(() => {
    if (stock) {
      setItemName(stock.title);
      setItemDescription(stock.description);
      setItemQuantity(stock.quantity);
      setItemPrice(stock.price);
    }
  }, [stock]);

  const handleSave = async () => {
    const trimmedQuantity = parseInt(itemQuantity.trim());
    const trimmedPrice = parseFloat(itemPrice.trim());

    if (itemName.trim().length < 4 || itemName.trim().length > 15) {
      toast.error("Name must be 4-15 characters long.");
      return;
    };

    if (itemDescription.trim().length < 10 || itemDescription.trim().length > 100) {
      toast.error("Description must be 10-100 characters long.");
      return;
    };

    if (!trimmedQuantity) {
      toast.error("Quantity must be greater than 0.");
      return;
    };

    if (!trimmedPrice) {
      toast.error("Price must be greater than 0.");
      return;
    };

    try {
      await axios.post("http://localhost:3000/stock", {
        itemName: itemName,
        description: itemDescription,
        price: trimmedPrice,
        quantity: trimmedQuantity
      });
      toast.success("Stock created successfully.")
    } catch (error) {
      if (error.response.status === 400) {
        toast.error("Failed to create your stock");
      } else {
        console.log("Error occur while create my new stock", error);
        toast.error("Something wrong please try again later");
      }
    } finally {
      setShowModal(false);
    }

    setShowModal(false);
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body p-4">
              <h5 className="modal-title mt-2 mb-4 text-center">{stock ? 'Edit Stock' : 'Add New Stock'}</h5>
              <form>
                <div className="mb-3">
                  <label className="form-label">Item Name</label>
                  <input type="text" className="form-control" value={itemName} onChange={(e) => setItemName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea type="text" style={{ maxHeight: "150px", minHeight: "80px" }} className="form-control" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input type="number" className="form-control" value={itemQuantity} onChange={(e) => setItemQuantity(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input type="number" className="form-control" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
                </div>
              </form>
              <div className="d-flex justify-content-end gap-2">
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                <button type="button" className="btn btn-dark" onClick={handleSave}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockModal;