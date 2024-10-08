import { useEffect, useState } from 'react';
import { toast } from "sonner";
import baseAxios from "../../../Config/jwtInterceptor";

const SalesModal = ({ setShowModal, handleError, setSales }) => {
  const [productName, setProductName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [itemQuantity, setItemQuantity] = useState(1);
  const [itemPrice, setItemPrice] = useState(0);

  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [choosenProduct, setChoosenProduct] = useState(null);

  useEffect(() => {
    const inventoryStocks = localStorage.getItem("inventoryStocks");
    if (inventoryStocks) {
      setProducts(JSON.parse(inventoryStocks));
    };
    const localStorageCustomers = localStorage.getItem("customers");
    if (localStorageCustomers) {
      setCustomers(JSON.parse(localStorageCustomers));
    };
  }, []);

  const handleSave = async () => {
    try {
      const response = await baseAxios.post("/sales", {
        customerName: customerName,
        productName: productName,
        productID: choosenProduct.id,
        quantity: itemQuantity,
        price: itemPrice
      });
      setSales((prevSales) => [...prevSales, response.data]);
      const afterCreatingNewSale = products.map((pro) => (pro.id === choosenProduct.id ? { ...pro, quantity: choosenProduct.quantity - itemQuantity } : pro));
      localStorage.setItem("inventoryStocks", JSON.stringify(afterCreatingNewSale));
      toast.success("New sale is recorded");
      setShowModal(false);
    } catch (error) {
      handleError(error);
    };
  };

  const changeSelectedProduct = (e) => {
    const selectedProduct = products.find((product) => product.id === e.target.value);
    setProductName(selectedProduct?.itemName);
    setItemPrice(selectedProduct?.price);
    setChoosenProduct(selectedProduct);
    setItemQuantity(selectedProduct?.quantity > 0 ? 1 : 0);
  };

  const handleIncrementCount = () => {
    if (choosenProduct?.quantity > itemQuantity) {
      const newQuantity = itemQuantity + 1;
      setItemQuantity(newQuantity);
      setItemPrice(newQuantity * choosenProduct.price);
    } else {
      toast.dismiss();
      toast.warning(`Only available ${choosenProduct ? choosenProduct.quantity : 0} quantity`);
    };
  };

  const handleDecrementCount = () => {
    if (itemQuantity > 1) {
      const newQuantity = itemQuantity - 1;
      setItemQuantity(newQuantity);
      setItemPrice(newQuantity * choosenProduct.price);
    } else {
      toast.dismiss();
      toast.warning(`Quantity must be at least one`);
    };
  };

  return (
    <>
      <div className="modal-backdrop fade show" />
      <div className="modal show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content">
            <div className="modal-body p-4">
              <h5 className="modal-title mt-2 mb-4 text-center">Add New Sale</h5>
              <div className="mb-3">
                <label className="form-label">Product Name</label>
                <select
                  className="form-select"
                  value={choosenProduct ? choosenProduct.name : ""}
                  onChange={changeSelectedProduct}
                >
                  <option value="" disabled>Select Product</option>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <option key={product.id} value={product.id}>{product.itemName}</option>
                    ))
                  ) : (
                    <option value="" disabled>No products found</option>
                  )}
                </select>

              </div>
              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <select className="form-select" value={customerName} onChange={(e) => setCustomerName(e.target.value)}>
                  <option value="" disabled>Select customer</option>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <option key={customer.id} value={customer.customerName}>{customer.customerName}</option>
                    ))
                  ) : (
                    <option value="" disabled>No customers found</option>
                  )}
                </select>
              </div>
              {choosenProduct && (
                <>
                  <div className="mb-3 d-flex justify-content-between gap-3">
                    <div>
                      <label className="form-label">Quantity</label>
                      <div className="d-flex gap-1">
                        <button type="button" className="btn btn-secondary" style={{ width: "50px" }} onClick={handleDecrementCount}>-</button>
                        <input style={{ textAlign: "center", maxWidth: "100px" }} className="form-control" value={itemQuantity} readOnly />
                        <button type="button" className="btn btn-secondary" style={{ width: "50px" }} onClick={handleIncrementCount}>+</button>
                      </div>
                    </div>
                    <div>
                      <label className="form-label">Price</label>
                      <input type="number" className="form-control" value={itemPrice} readOnly />
                    </div>
                  </div>
                </>
              )}
              <div className="d-flex justify-content-center gap-2 mt-5">
                <button type="button" className="btn btn-danger" onClick={() => setShowModal(false)}>Close</button>
                {choosenProduct && (
                  <button type="button" className="btn btn-dark" onClick={handleSave}>Save changes</button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesModal;