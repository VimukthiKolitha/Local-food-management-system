import React from "react";
import NavBar from "./components/NavBar/NavBar";
import SideBar from "./components/SideBar/SideBar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Edit from "./pages/Edit/Edit.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ListOrder from "./orderPages/List/ListOrder.jsx";
import EditOrder from "./orderPages/Edit/EditOrder.jsx";
import ListPayment from "./paymentPages/ListPayment/ListPayment.jsx";
import EditPayment from "./paymentPages/EditPayment/EditPayment.jsx";
import Home from "./deliveryPages/list/Home.jsx";
import CreatePost from "./deliveryPages/create/CreatePosts.jsx";
import EditPost from "./deliveryPages/edit/EditPost.jsx";
import PostDetails from "./deliveryPages/sendEmail/PostDetails.jsx";
import Dashboard from "./dashboard/dashboard.jsx";
import AddSupplierPayment from "./paymentPages/AddExpenses/AddSupplierPayment.jsx";
import EditExpense from "./paymentPages/EditPayment/EditExpense.jsx";

const App = () => {
  const url = "http://localhost:4000";

  return (
    <div>
      <ToastContainer />
      <NavBar />
      <hr />
      <div className="app-content">
        <SideBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<Add url={url} />} />
          <Route path="/list" element={<List url={url} />} />
          <Route path="/order" element={<ListOrder url={url} />} />
          <Route path="/edit/:id" element={<Edit url={url} />} />
          <Route path="/edit/order/:id" element={<EditOrder />} />
          <Route path="/list-payment" element={<ListPayment />} />
          <Route path="/edit-payment/:id" element={<EditPayment />} />
          <Route path="/delivery/list" element={<Home />} />
          <Route path="/delivery/add" element={<CreatePost />} />
          <Route path="/delivery/edit/:id" element={<EditPost />} />
          <Route path="/delivery/post/:id" element={<PostDetails />} />
          <Route
            path="/add-supplier-payment"
            element={<AddSupplierPayment />}
          />
          <Route path="/edit-expense/:id" element={<EditExpense />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
