import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditExpense = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    orderID: "",
    supplierEmail: "",
    totalAmount: "",
    orderDate: new Date(),
  });

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

  const { id } = useParams(); // Get the expense ID
  const navigate = useNavigate();

  // Fetch expense data
  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/expenses/${id}`
        );
        const expense = response.data;

        setFormData({
          supplierName: expense.supplierName || "",
          orderID: expense.orderID || "",
          supplierEmail: expense.supplierEmail || "",
          totalAmount: expense.totalAmount || "",
          orderDate: expense.orderDate
            ? new Date(expense.orderDate)
            : new Date(),
        });
      } catch (error) {
        toast.error("Failed to fetch expense details");
        console.error("Error fetching expense:", error);
      }
    };

    fetchExpense(); // Call the fetch function inside useEffect
  }, [id]);

  const validateForm = () => {
    let formErrors = { supplierEmail: "", totalAmount: "", orderDate: "" };
    let isValid = true;

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.supplierEmail)) {
      formErrors.supplierEmail = "Please enter a valid email address.";
      isValid = false;
    }

    // Total amount validation
    if (Number(formData.totalAmount) < 0) {
      formErrors.totalAmount = "Total amount cannot be negative.";
      isValid = false;
    }

    // Order date validation
    const today = new Date();
    if (formData.orderDate < today.setHours(0, 0, 0, 0)) {
      formErrors.orderDate = "Order date cannot be a past date.";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before submission
    if (!validateForm()) return;

    try {
      await axios.put(
        `http://localhost:4000/api/expenses/update/${id}`,
        formData
      );
      toast.success("Expense updated successfully");
      navigate("/list-payment");
    } catch (error) {
      toast.error("Failed to update expense");
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="container">
      <h2>Edit Expense</h2>
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
          <p style={{ color: "red" }}>{errors.supplierEmail}</p>
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
          <p style={{ color: "red" }}>{errors.totalAmount}</p>
        )}

        <label>Order Date:</label>
        <DatePicker
          selected={formData.orderDate}
          onChange={(date) => setFormData({ ...formData, orderDate: date })}
        />
        {errors.orderDate && <p style={{ color: "red" }}>{errors.orderDate}</p>}

        <button type="submit">Update Expense</button>
      </form>
    </div>
  );
};

export default EditExpense;
