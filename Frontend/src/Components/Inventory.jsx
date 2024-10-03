import { useState } from 'react';
import StockModal from './StockModal';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";

const Inventory = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchData, setSearchData] = useState('');
  const [stocks, setStocks] = useState([
    { id: 1, title: "Wooden Chair", description: "High-quality wooden chair suitable for dining or office use.", quantity: "25", price: "5000" },
    { id: 2, title: "Steel Table", description: "Durable steel table perfect for workspaces.", quantity: "10", price: "12000" },
    { id: 3, title: "Leather Sofa", description: "Luxurious leather sofa with a modern design.", quantity: "5", price: "30000" },
    { id: 4, title: "Office Desk", description: "Spacious office desk with built-in storage.", quantity: "15", price: "15000" },
    { id: 5, title: "Bookcase", description: "Stylish bookcase made from reclaimed wood.", quantity: "20", price: "8000" },
    { id: 6, title: "Garden Bench", description: "Rustic garden bench perfect for outdoor spaces.", quantity: "8", price: "7000" },
    { id: 7, title: "Dining Set", description: "Complete dining set for six people.", quantity: "12", price: "40000" },
    { id: 8, title: "Coffee Table", description: "Elegant coffee table with a glass top.", quantity: "30", price: "6000" },
    { id: 9, title: "Storage Cabinet", description: "Ample storage cabinet with adjustable shelves.", quantity: "10", price: "20000" },
    { id: 10, title: "Folding Chair", description: "Lightweight and portable folding chair.", quantity: "50", price: "2000" },
  ]);

  const handleEditClick = (stock) => {
    setSelectedStock(stock);
    setShowModal(true);
  };

  const addNewStock = () => {
    setSelectedStock(null);
    setShowModal(true);
  };

  const filteredStocks = stocks.filter(stock => (stock.title.toLowerCase().includes(searchData.toLowerCase()) || stock.description.toLowerCase().includes(searchData.toLowerCase())));

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col">
          <h4 className="text-left"><b>My Inventories</b></h4>
        </div>
        <div className="col-auto d-flex gap-2">
          <input type="search" className="red_input" placeholder="Enter name or description" aria-label="Search" value={searchData} onChange={(e) => setSearchData(e.target.value)} />
          <button className="btn btn-danger" onClick={addNewStock}>Add new stock</button>
        </div>
      </div>
      <div className="ag-courses_box">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock) => (
            <div className="ag-courses_item" key={stock.id}>
              <div className="ag-courses-item_link">
                <div className="ag-courses-item_bg" />
                <p className="ag-courses-item_title">{stock.title}</p>
                <p className="ag-courses-item_date-box"><span className="ag-courses-item_date">Description: </span>{stock.description}</p>
                <p className="ag-courses-item_date-box"><span className="ag-courses-item_date">Quantity: </span>{stock.quantity}</p>
                <p className="ag-courses-item_date-box"><span className="ag-courses-item_date">Price: </span>₹{stock.price}.00</p>
                <div className="ag-courses-item_actions">
                  <MdEdit className="icon edit-icon" onClick={() => handleEditClick(stock)} />
                  <RiDeleteBin6Fill className="icon delete-icon" />
                </div>
              </div>
            </div>
          ))
        ): (
          <h5 className="mt-7">No details recorded</h5>
        )}
      </div>
      {showModal && (
        <StockModal setShowModal={setShowModal} stock={selectedStock} />
      )}
    </div>
  );
};

export default Inventory;