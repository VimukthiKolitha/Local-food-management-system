import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AddSupplierPayment.css";

const AddSupplierPayment = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    orderID: "",
    supplierEmail: "",
    totalAmount: "",
    orderDate: new Date(),
  });

  // Validation state
  const [errors, setErrors] = useState({
    supplierEmail: "",
    totalAmount: "",
    orderDate: "",
  });

  const [suppliers] = useState([
    { _id: "1", name: "Supplier One" },
    { _id: "2", name: "Supplier Two" },
    { _id: "3", name: "Supplier Three" },
  ]);

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = { supplierEmail: "", totalAmount: "", orderDate: "" };
    let isValid = true;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.supplierEmail)) {
      newErrors.supplierEmail = "Please enter a valid email address.";
      isValid = false;
    }

    // Total amount validation
    if (Number(formData.totalAmount) < 0) {
      newErrors.totalAmount = "Total amount cannot be negative.";
      isValid = false;
    }

    // Order date validation
    const today = new Date();
    if (formData.orderDate < today.setHours(0, 0, 0, 0)) {
      newErrors.orderDate = "Order date cannot be a past date.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await axios.post("http://localhost:4000/api/expenses/create", formData);
        toast.success("Supplier payment added successfully");
        navigate("/list-payment");
      } catch (error) {
        toast.error("Failed to add payment");
      }
    }
  };

  return (
    <div className="container">
      <h2>Add Supplier Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>Supplier Name:</label>
        <select
          value={formData.supplierName}
          onChange={(e) =>
            setFormData({ ...formData, supplierName: e.target.value })
          }
          required
        >
          <option value="">Select Supplier</option>
          {suppliers.map((supplier) => (
            <option key={supplier._id} value={supplier.name}>
              {supplier.name}
            </option>
          ))}
        </select>

        <label>Order ID:</label>
        <input
          type="text"
          value={formData.orderID}
          onChange={(e) =>
            setFormData({ ...formData, orderID: e.target.value })
          }
          required
        />

        <label>Supplier Email:</label>
        <input
          type="email"
          value={formData.supplierEmail}
          onChange={(e) =>
            setFormData({ ...formData, supplierEmail: e.target.value })
          }
          required
        />
        {errors.supplierEmail && (
          <span style={{ color: "red" }}>{errors.supplierEmail}</span>
        )}

        <label>Total Amount:</label>
        <input
          type="number"
          value={formData.totalAmount}
          onChange={(e) =>
            setFormData({ ...formData, totalAmount: e.target.value })
          }
          required
        />
        {errors.totalAmount && (
          <span style={{ color: "red" }}>{errors.totalAmount}</span>
        )}

        <label>Order Date:</label>
        <DatePicker
          selected={formData.orderDate}
          onChange={(date) => setFormData({ ...formData, orderDate: date })}
        />
        {errors.orderDate && (
          <span style={{ color: "red" }}>{errors.orderDate}</span>
        )}

        <button type="submit">Add Payment</button>
      </form>
    </div>
  );
};

export default AddSupplierPayment;
