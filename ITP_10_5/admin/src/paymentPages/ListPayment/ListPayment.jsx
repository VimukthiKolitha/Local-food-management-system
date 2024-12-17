import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ListPayment.css";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ListPayment = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchExpenseTerm, setSearchExpenseTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/payment");
        const expenseResponse = await axios.get(
          "http://localhost:4000/api/expenses"
        );
        console.log("API Response:", response.data);
        setPayments(response.data.payments || response.data || []);
        setExpenses(expenseResponse.data.expenses || []);
      } catch (error) {
        console.error("Error fetching payments", error);
        toast.error("Failed to fetch payments");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edit-payment/${id}`);
  };

  const handleAddSupplierPayment = () => {
    navigate("/add-supplier-payment");
  };

  const handleEditExpense = (id) => {
    navigate(`/edit-expense/${id}`);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/payment/delete/${id}`);
      setPayments(payments.filter((payment) => payment._id !== id));
      toast.success("Payment deleted successfully");
    } catch (error) {
      console.error("Error deleting payment", error);
      toast.error("Error deleting payment");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/expenses/delete/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.success("Expense deleted successfully");
    } catch (error) {
      toast.error("Error deleting expense");
    }
  };

  const generatePDFReport = () => {
    const doc = new jsPDF();
    doc.text("Payment List Report - Income", 20, 10);

    const filteredPayments = payments.filter((payment) =>
      payment.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const tableData = filteredPayments.map((payment) => [
      payment.orderID,
      payment.name,
      payment.email,
      `Rs ${payment.amount}.00`,
      payment.status,
      payment.date,
    ]);

    doc.autoTable({
      head: [["Order ID", "Name", "Email", "Amount", "Status", "Date"]],
      body: tableData,
      startY: 20,
    });

    // Calculate total income
    const totalIncome = calculateTotalIncome(filteredPayments);
    doc.text(
      `Total Income: Rs ${totalIncome}.00`,
      20,
      doc.autoTable.previous.finalY + 10
    );

    doc.save("payment_report.pdf");
  };

  //calculate the profit
  const calculateProfit = (payments, expenses) => {
    const totalIncome = calculateTotalIncome(payments);
    const totalExpenses = calculateTotalExpenses(expenses);
    return totalIncome - totalExpenses;
  };

  const generateExpensePDFReport = () => {
    const doc = new jsPDF();
    doc.text("Expense List Report", 20, 10);

    const filteredExpenses = expenses.filter((expense) =>
      expense.supplierName
        .toLowerCase()
        .includes(searchExpenseTerm.toLowerCase())
    );

    const tableData = filteredExpenses.map((expense) => [
      expense.orderID,
      expense.supplierName,
      expense.supplierEmail,
      `Rs ${expense.totalAmount}.00`,
      new Date(expense.orderDate).toLocaleDateString(),
    ]);

    doc.autoTable({
      head: [["Order ID", "Supplier Name", "Email", "Amount", "Date"]],
      body: tableData,
      startY: 20,
    });

    // Calculate total expenses
    const totalExpense = calculateTotalExpenses(filteredExpenses);
    doc.text(
      `Total Expenses: Rs ${totalExpense}.00`,
      20,
      doc.autoTable.previous.finalY + 10
    );

    doc.save("expense_report.pdf");
  };

  const calculateTotalIncome = (payments) => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  const calculateTotalExpenses = (expenses) => {
    return expenses.reduce((total, expense) => total + expense.totalAmount, 0);
  };

  if (loading) {
    return <div>Loading payments...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="list add flex-col">
      <div className="list-header">
        <button
          onClick={generatePDFReport}
          style={{ width: "200px" }}
          className="generate-pdf-btn"
        >
          Generate PDF Report
        </button>
        <h1>Payment List</h1>
        <div className="flexbox">
          <div className="search">
            <div>
              <input
                type="text"
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>
      <h2>Income</h2>
      <table className="list-table">
        <thead>
          <tr>
            <th style={{ display: "none" }}>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(payments) && payments.length > 0 ? (
            payments
              .filter((payment) =>
                payment.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((payment) => (
                <tr key={payment._id}>
                  <td style={{ display: "none" }}>{payment.orderID}</td>
                  <td>{payment.name}</td>
                  <td>{payment.email}</td>
                  <td>Rs {payment.amount}.00</td>
                  <td>{payment.status}</td>
                  <td className="actions">
                    <button
                      className="update-btn"
                      onClick={() => handleEdit(payment._id)}
                    >
                      <img src={assets.edit_icon} className="icon" />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(payment._id)}
                    >
                      <img src={assets.delete_icon} className="icon" />
                    </button>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan="5">No payments found</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total ={" "}
            </td>
            <td style={{ textAlign: "left" }}>
              Rs{" "}
              {calculateTotalIncome(
                payments.filter((payment) =>
                  payment.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              )}
              .00
            </td>
          </tr>
        </tfoot>
      </table>
      <hr style={{ margin: "30px 0px 20px 0px" }} />
      <h2>Expenses</h2>
      <div className="list-header">
        <button onClick={handleAddSupplierPayment} className="add-btn">
          Add Supplier Payment
        </button>
        <div className="flexbox">
          <div className="search">
            <div>
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchExpenseTerm}
                onChange={(e) => setSearchExpenseTerm(e.target.value)} // Search functionality for expenses
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>
      <table className="list-table">
        <thead>
          <tr>
            <th>Supplier Name</th>
            <th>Order ID</th>
            <th>Email</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses
            .filter((expense) =>
              expense.supplierName
                .toLowerCase()
                .includes(searchExpenseTerm.toLowerCase())
            )
            .map((expense) => (
              <tr key={expense._id}>
                <td>{expense.supplierName}</td>
                <td>{expense.orderID}</td>
                <td>{expense.supplierEmail}</td>
                <td>Rs {expense.totalAmount}.00</td>
                <td>{new Date(expense.orderDate).toLocaleDateString()}</td>
                <td className="actions">
                  <button
                    className="update-btn"
                    onClick={() => handleEditExpense(expense._id)}
                  >
                    <img src={assets.edit_icon} className="icon" />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteExpense(expense._id)}
                  >
                    <img src={assets.delete_icon} className="icon" />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3" style={{ textAlign: "right", fontWeight: "bold" }}>
              Total ={" "}
            </td>
            <td style={{ textAlign: "left" }}>
              Rs{" "}
              {calculateTotalExpenses(
                expenses.filter((expense) =>
                  expense.supplierName
                    .toLowerCase()
                    .includes(searchExpenseTerm.toLowerCase())
                )
              )}
              .00
            </td>
          </tr>
        </tfoot>
      </table>
      <button onClick={generateExpensePDFReport} className="generate-pdf-btn">
        Generate Expenses PDF
      </button>
      <hr style={{ margin: "30px 0px 20px 0px" }} />
      <h2>Profit</h2>
      <div
        style={{
          fontSize: "18px",
          fontWeight: "bold",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        Profit: Rs {calculateProfit(payments, expenses)}.00
      </div>
    </div>
  );
};

export default ListPayment;
