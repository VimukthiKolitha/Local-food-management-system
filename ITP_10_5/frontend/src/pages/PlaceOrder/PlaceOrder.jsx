import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../components/LoginPopup/LoginPopup.css";
import { toast } from "react-toastify";

const districts = [
  "Colombo",
  "Gampaha",
  "Kalutara",
  "Kandy",
  "Matale",
  "Nuwara Eliya",
  "Galle",
  "Matara",
  "Hambantota",
  "Jaffna",
  "Kilinochchi",
  "Mannar",
  "Vavuniya",
  "Mullaitivu",
  "Batticaloa",
  "Ampara",
  "Trincomalee",
  "Kurunegala",
  "Puttalam",
  "Anuradhapura",
  "Polonnaruwa",
  "Badulla",
  "Monaragala",
  "Ratnapura",
  "Kegalle",
];

const PlaceOrder = ({ setShowLogin }) => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    district: "",
    zipcode: "",
    phone: "+94",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[A-Za-z]+$/;

    // Validate first name and last name
    if (!nameRegex.test(data.firstName)) {
      newErrors.firstName = "Cannot enter special characters";
    }
    if (!nameRegex.test(data.lastName)) {
      newErrors.lastName = "Cannot enter special characters";
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      newErrors.email = "Invalid email format";
    }

    // Validate phone number
    const phoneRegex = /^\+94\d{9}$/;
    if (!phoneRegex.test(data.phone)) {
      newErrors.phone = "Phone number must be 9 characters long";
    }

    // Validate zip code
    const zipRegex = /^[0-9]+$/;
    if (!zipRegex.test(data.zipcode)) {
      newErrors.zipcode = "Zip code must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const clearForm = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      district: "",
      zipcode: "",
      phone: "+94",
    });
    setErrors({});
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    if (!token) {
      setShowLogin(true);
      toast.error("You did not login yet, Please login to continue");
      return;
    }

    // Stop form submission if there are validation errors
    if (!validateForm()) {
      return;
    }

    // Prepare order data
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 150, // Add delivery fee
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { orderId } = response.data;
        const paymentData = {
          orderID: orderId,
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          amount: getTotalCartAmount() + 150,
        };
        await axios.post(`${url}/api/payment/create`, paymentData, {
          headers: { token },
        });
        navigate(`/success?orderId=${orderId}`);
      } else {
        toast.error("Error placing order!");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again!");
    }
  };

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-field">
          <div className="input-group">
            <input
              type="text"
              name="firstName"
              value={data.firstName}
              onChange={onChangeHandler}
              placeholder="First Name"
              required
            />
            {errors.firstName && (
              <span className="error">{errors.firstName}</span>
            )}
          </div>
          <div className="input-group">
            <input
              type="text"
              name="lastName"
              value={data.lastName}
              onChange={onChangeHandler}
              placeholder="Last Name"
              required
            />
            {errors.lastName && (
              <span className="error">{errors.lastName}</span>
            )}
          </div>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="Email Address"
            required
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="input-group">
          <input
            type="text"
            name="addressLine1"
            value={data.addressLine1}
            onChange={onChangeHandler}
            placeholder="Address Line 1"
            required
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            name="addressLine2"
            value={data.addressLine2}
            onChange={onChangeHandler}
            placeholder="Address Line 2"
          />
        </div>

        <div className="multi-field">
          <div className="input-group">
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={onChangeHandler}
              placeholder="City"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="text"
              name="zipcode"
              value={data.zipcode}
              onChange={onChangeHandler}
              placeholder="Zip Code"
              required
            />
            {errors.zipcode && <span className="error">{errors.zipcode}</span>}
          </div>
        </div>

        <div className="input-group dropdown">
          <select
            name="district"
            value={data.district}
            onChange={onChangeHandler}
            required
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={onChangeHandler}
            placeholder="+94 XXXXXXXXX"
            required
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>
        <button type="button" onClick={clearForm} className="clear-btn">
          Clear
        </button>
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs.{getTotalCartAmount()}.00</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs.{getTotalCartAmount() === 0 ? 0 : 150}.00</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>
              Rs.{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 150}
              .00
            </b>
          </div>
          <button style={{ width: "300px", margin: "20px 80px" }} type="submit">
            Place Order
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
