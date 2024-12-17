import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ListOrder.css";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Modal from "react-modal";
import "../../Styles/search.css"
import "../../Styles/table.css"

const ListOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrderItems, setSelectedOrderItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/order");
        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError("Failed to fetch orders");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Something went wrong while fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/order/delete/${id}`);
      setOrders(orders.filter((order) => order._id !== id));
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order");
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit/order/${id}`);
  };

  const openModal = (items) => {
    setSelectedOrderItems(items);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const filteredOrders = orders.filter((order) =>
    order.userId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text("Order List Report", 20, 10);

    const tableData = filteredOrders.map((order) => [
      order._id,
      order.userId.name,
      `Rs ${order.amount}.00`,
      order.status,
      new Date(order.date).toLocaleString(),
    ]);

    doc.autoTable({
      head: [["Order ID", "User Name", "Amount", "Status", "Date"]],
      body: tableData,
      startY: 20,
    });

    const unpaidOrders = filteredOrders.filter((order) => !order.payment);

    doc.text(`Summary Report:`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(
      `Unpaid Orders: ${unpaidOrders.length}`,
      14,
      doc.lastAutoTable.finalY + 20
    );

    doc.save("order_report.pdf");
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <h2>All Orders</h2>
            <div className="search">
              <input
                type="search"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
            </div>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th className="order-id">Order ID</th>
            <th>User Name</th>
            <th>Items</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="8">No orders found</td>
            </tr>
          ) : (
            filteredOrders.map((order) => (
              <tr key={order._id}>
                <td className="order-id">{order._id}</td>
                <td>{order.userId.name}</td>
                <td>
                  <button
                    style={{ width: "100px" }}
                    className="view-items-btn"
                    onClick={() => openModal(order.items)}
                  >
                    View Items
                  </button>
                </td>
                <td>Rs {order.amount}.00</td>
                <td>
                  <div className="order-status">
                    <div
                      className={`status-indicator ${
                        order.payment ? "status-paid" : "status-unpaid"
                      }`}
                    ></div>
                    {order.status}
                  </div>
                </td>
                <td>{new Date(order.date).toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="update-btn"
                    onClick={() => handleEdit(order._id)}
                  >
                    <img src={assets.edit_icon} className="icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(order._id)}
                  >
                    <img src={assets.delete_icon} className="icon" />
                  </button>
                  <br />
                  <br />
                  <br />
                  <br />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button onClick={generatePDFReport} className="generate-pdf-btn">
        Generate PDF Report
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="View Items"
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        <h2>Items in Order</h2>
        <ul>
          {selectedOrderItems.map((item, index) => (
            <li key={index}>
              {item.name} - Quantity: {item.quantity}
            </li>
          ))}
        </ul>
        <button
          onClick={closeModal}
          style={{ width: "70px" }}
          className="close-modal-btn"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

export default ListOrder;
