import orderModel from "../models/orderModel.js";

// Get all orders with user details
const getAllOrders = async (req, res) => {
  try {
    // Fetch orders and populate the 'userId' field with the user's name
    const orders = await orderModel.find().populate('userId', 'name');
    console.log(orders);
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
    });
  }
};


// Read a specific order
const getOrderById = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.json({ success: false, message: "Error fetching order." });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { orderId } = req.params;
  const updatedData = req.body;
  
  try {
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, updatedData, { new: true });
    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Error updating order:", error);
    res.json({ success: false, message: "Error updating order." });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { orderId } = req.params;
  
  try {
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, message: "Order deleted successfully." });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.json({ success: false, message: "Error deleting order." });
  }
};

export { getAllOrders, getOrderById, updateOrder, deleteOrder };
