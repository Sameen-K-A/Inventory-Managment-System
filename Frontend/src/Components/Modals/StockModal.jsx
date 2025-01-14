import { useState, useEffect } from 'react';
import { toast } from "sonner";
import baseAxios from "../../Config/jwtInterceptor";
import { useNavigate } from 'react-router-dom';

const StockModal = ({ setShowModal, selectedStock, stocks, setStocks }) => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedStock) {
      setItemName(selectedStock.itemName);
      setItemDescription(selectedStock.description);
      setItemQuantity(selectedStock.quantity);
      setItemPrice(selectedStock.price);
    }
  }, [selectedStock]);

  const handleSave = async () => {
    try {

      const trimmedQuantity = parseInt(itemQuantity.toString().trim());
      const trimmedPrice = parseFloat(itemPrice.toString().trim());

      if (itemName.trim().length < 3 || itemName.trim().length > 50) {
        toast.error("Name must be 3-50 characters long.");
        return;
      };

      if (itemDescription.trim().length < 10 || itemDescription.trim().length > 100) {
        toast.error("Description must be 10-100 characters long.");
        return;
      };

      if (trimmedQuantity < 0) {
        toast.error("Quantity must be positive number.");
        return;
      };

      if (trimmedPrice <= 0) {
        toast.error("Price must be greater than 0.");
        return;
      };

      isLoading(true)

      const data = {
        itemName: itemName,
        description: itemDescription,
        price: trimmedPrice,
        quantity: trimmedQuantity
      }

      if (selectedStock) {
        data.itemID = selectedStock.itemID;
        await baseAxios.patch("/stock", data);
        const afterUpdate = stocks.map((stock) => stock.id === selectedStock.id ? data : stock);
        setStocks(afterUpdate);
        localStorage.setItem("inventoryStocks", JSON.stringify(afterUpdate));
        toast.success("Stock updated successfully.");
      } else {
        const response = await baseAxios.post("/stock", data);
        const afterCreate = [...stocks, response.data];
        setStocks(afterCreate);
        localStorage.setItem("inventoryStocks", JSON.stringify(afterCreate));
        toast.success("Stock created successfully.");
      }
      setShowModal(false);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };


  const handleError = (error) => {
    if (error.response.status === 401) {
      navigate("/login", { state: { message: "Authentication failed, Please login." } });
    } else if (error.response.status === 400) {
      if (selectedStock) {
        toast.error("No changes found.");
      } else {
        toast.error("Failed to update resourse.");
      }
    } else {
      console.error(error);
      toast.error("Something wrong please try again later.");
    };
    setShowModal(false);
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body p-4">
              <h5 className="modal-title mt-2 mb-4 text-center">{selectedStock ? 'Edit Stock' : 'Add New Stock'}</h5>
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
                <button type="button" className="btn btn-dark" disabled={isLoading} onClick={handleSave}>{isLoading ? "Loading..." : "Save"}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockModal;