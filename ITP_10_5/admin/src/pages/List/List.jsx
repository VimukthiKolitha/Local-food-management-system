import React, { useState, useEffect } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { assets } from "../../assets/assets";
import "../../Styles/search.css"

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching the list");
      }
    } catch (error) {
      console.error("Error fetching the list:", error);
      toast.error("Error fetching the list");
    }
  };

  const removeFoods = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Error");
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Error removing food");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockLevelStyle = (quantity) => {
    let color;
    let width;

    if (quantity === 0) {
      return { backgroundColor: "red", width: "100%" };
    } else if (quantity < 5) {
      color = "red";
      width = "25%";
    } else if (quantity <= 15) {
      color = "#ffd000";
      width = "50%";
    } else {
      color = "rgb(128, 207, 0)";
      width = "100%";
    }

    return { backgroundColor: color, width: width };
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();

    doc.text("Item List Report", 20, 10);

    const tableData = filteredList.map((item) => [
      item.name,
      item.category,
      `Rs ${item.price}.00`,
      item.quantity,
      item.quantity > 0 ? "In Stock" : "Out of Stock",
    ]);

    doc.autoTable({
      head: [["Name", "Category", "Price", "Quantity", "Stock Level"]],
      body: tableData,
      startY: 20,
    });

    const lowStockItems = filteredList.filter(
      (item) => item.quantity < 5 && item.quantity > 0
    );
    const outOfStockItems = filteredList.filter((item) => item.quantity === 0);

    doc.text(`Summary Report:`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(
      `Low Stock Items: ${lowStockItems.length}`,
      14,
      doc.lastAutoTable.finalY + 20
    );
    doc.text(
      `Out of Stock Items: ${outOfStockItems.length}`,
      14,
      doc.lastAutoTable.finalY + 30
    );

    doc.save("item_report.pdf");
  };

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <Link to={`/add`} className="add-item-btn">
          Add Item
        </Link>
        <p>All Foods List</p>
            <div className="search">
              <input
                type="search"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
            </div>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>
              Price
              <br />
              (Per Unit)
            </th>
            <th>Quantity</th>
            <th>Stock Level</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length > 0 ? (
            filteredList.map((item, index) => (
              <tr key={index}>
                <td>
                  <img
                    src={`${url}/images/${item.image}`}
                    alt={item.name}
                    className="food-image"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>Rs {item.price}.00</td>
                <td>{item.quantity}</td>
                <td>
                  <div className="stock-level-bar">
                    {item.quantity === 0 ? (
                      <div className="stock-level-fill out-of-stock">
                        Out of Stock
                      </div>
                    ) : (
                      <div
                        className="stock-level-fill"
                        style={getStockLevelStyle(item.quantity)}
                      ></div>
                    )}
                  </div>
                </td>
                <td className="actions">
                  <Link to={`/edit/` + item._id} className="update-btn">
                    <img
                      src={assets.edit_icon}
                      alt="Edit Icon"
                      className="icon"
                    />
                  </Link>
                  <button
                    className="delete-btn"
                    onClick={() => removeFoods(item._id)}
                  >
                    <img
                      src={assets.delete_icon}
                      alt="Delete Icon"
                      className="icon"
                    />
                  </button>
                  <br />
                  <br />
                  <br />
                  <br />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">
                <h3>No Item Found for your search</h3>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={generatePDFReport} className="add-item-btn">
        Generate PDF Report
      </button>
    </div>
  );
};

export default List;
