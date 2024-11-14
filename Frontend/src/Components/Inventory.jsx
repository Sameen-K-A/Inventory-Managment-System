import { useEffect, useState, useCallback } from 'react';
import { debounce } from "lodash";
import StockModal from './Modals/StockModal';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { toast } from 'sonner';
import baseAxios from "../Config/jwtInterceptor";
import { useNavigate } from 'react-router-dom';
import UserNavbar from "./Navbar";
import NoDataFound from './NoDataFound';
import StockSkeleton from './Skeleton/StockSkeleton';

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchData, setSearchData] = useState('');
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEditClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const addNewStock = () => {
    setSelectedStock(null);
    setShowModal(true);
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const localStorageData = localStorage.getItem("inventoryStocks");
        if (localStorageData) {
          setStocks(JSON.parse(localStorageData));
        } else {
          const response = await baseAxios.get("/stock");
          setStocks(response.data);
          localStorage.setItem("inventoryStocks", JSON.stringify(response.data));
        }
      } catch (error) {
        handleError(error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const handleDeleteProduct = async (productId) => {
    try {
      await baseAxios.delete("/stock", { params: { productId } });
      const updatedStocks = stocks.filter((stock) => stock.itemID !== productId);
      setStocks(updatedStocks);
      localStorage.setItem("inventoryStocks", JSON.stringify(updatedStocks));
      toast.success("Item deleted successfully.");
    } catch (error) {
      handleError(error);
    }
  };

  const confirmDeleteToast = (productId) => {
    toast.dismiss();
    toast.custom(
      () => (
        <div className="bg-dark p-3" style={{ borderRadius: 20 }}>
          <h6 className="text-light">Are you sure you want to delete this product?</h6>
          <div className="d-flex justify-content-end gap-2 mt-3">
            <button className="btn btn-sm btn-secondary" onClick={() => toast.dismiss()}>Cancel</button>
            <button className="btn btn-sm btn-danger" onClick={() => { handleDeleteProduct(productId); toast.dismiss(); }}>
              Confirm
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  const debouncedSearch = useCallback(
    debounce(async (value) => {
      if (value.trim()) {
        try {
          const response = await baseAxios.get("/search", {
            params: { searchData: value },
          });
          setStocks(response.data);
        } catch (error) {
          handleError(error);
        }
      }
    }, 1000),
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchData(value);
    if (value.trim() === "") {
      const localStorageData = localStorage.getItem("inventoryStocks");
      if (localStorageData) {
        setStocks(JSON.parse(localStorageData));
      }
    } else {
      debouncedSearch(value);
    }
  };

  const handleError = (error) => {
    if (error.response && error.response.status === 401) {
      navigate("/login", { state: { message: "Authentication failed, Please login." } });
    } else if (error.response && error.response.status === 400) {
      toast.error("Failed to update resource.");
    } else {
      console.error(error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <>
      <UserNavbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col">
            <h4 className="text-left"><b>My Inventories</b></h4>
          </div>
          <div className="col-auto d-flex gap-2">
            <input type="search" className="red_input" placeholder="Enter name or description" aria-label="Search" value={searchData} onChange={handleSearchChange} />
            <button className="btn btn-dark" onClick={addNewStock}>Add new stock</button>
          </div>
        </div>
        {isLoading ? (
          <StockSkeleton />
        ) : (
          <div className="ag-courses_box">
            {stocks.length > 0 ? (
              stocks.map((stock) => (
                <div className="ag-courses_item" key={stock.itemID}>
                  <div className="ag-courses-item_link">
                    <div className="ag-courses-item_bg" />
                    <p className="ag-courses-item_title">{stock.itemName}</p>
                    <p className="ag-courses-item_date-box"><span className="ag-courses-item_date">Description: </span>{stock.description}</p>
                    <p className="ag-courses-item_date-box"><span className="ag-courses-item_date">Quantity: </span>{stock.quantity}</p>
                    <p className="ag-courses-item_date-box"><span className="ag-courses-item_date">Price: </span>₹{stock.price}.00</p>
                    <div className="ag-courses-item_actions">
                      <MdEdit className="icon edit-icon" onClick={() => handleEditClick(stock)} />
                      <RiDeleteBin6Fill className="icon delete-icon" onClick={() => confirmDeleteToast(stock.itemID)} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <NoDataFound />
            )}
          </div>
        )}
        {showModal && (
          <StockModal setShowModal={setShowModal} selectedStock={selectedStock} stocks={stocks} setStocks={setStocks} />
        )}
      </div>
    </>
  );
};

export default Inventory;