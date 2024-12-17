import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Order.css';
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';

// Modal component to show items in the order
const OrderItemsModal = ({ isOpen, onClose, items }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Order Items</h2>
        <ul>
          {items.map((item, index) => (
            <li key={index}>
              {item.name} (Qty: {item.quantity})
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderItems, setSelectedOrderItems] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:4000/api/order/user/orders', {
          headers: { token }
        });

        if (response.data.success) {
          setOrders(response.data.orders);
        } else {
          setError('Failed to fetch orders');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Something went wrong while fetching orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewItems = (items) => {
    setSelectedOrderItems(items);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderItems(null);
  };

  const handleCopyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId).then(() => {
      toast.success('Order ID copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy order ID: ', err);
    });
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="user-orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-summary">
            <div className="order-header">
              <h3>{order.status}</h3>
              <p>Order date: {new Date(order.date).toLocaleDateString()}</p>
              <p>
                Order ID: {order._id}
                <a
                  className="copy-link"
                  onClick={() => handleCopyOrderId(order._id)}
                >
                  <img src={assets.copy_icon} style={{width:"20px"}} alt="" />
                </a>
              </p>
              <button
                className="view-items-button"
                onClick={() => handleViewItems(order.items)}
              >
                View Items
              </button>
            </div>
            <div className="order-details">
              <p>
                <strong>Total:</strong> Rs {order.amount}.00
              </p>
            </div>
            <hr />
          </div>
        ))
      )}

      {/* Modal for showing items */}
      <OrderItemsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        items={selectedOrderItems || []}
      />
    </div>
  );
};

export default Order;
