import React, { useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("Home");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);

  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem("token");
    setToken("");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img
          src={assets.logo}
          alt=""
          className="logo"
          style={{ width: "80px" }}
        />
      </Link>
      <ul className="navbar-menu">
        <Link to="/Home">
          <li
            onClick={() => setMenu("Home")}
            className={menu == "Home" ? "active" : ""}
          >
            <b>Home</b>
          </li>
        </Link>
        <Link to="/Header">
          {" "}
          <li
            onClick={() => setMenu("Shop")}
            className={menu == "Shop" ? "active" : ""}
          >
            <b>Shop</b>
          </li>
        </Link>
        <Link to="/Aboutus">
          <li
            onClick={() => setMenu("About Us")}
            className={menu == "About Us" ? "active" : ""}
          >
            <b>About Us</b>
          </li>
        </Link>
        <Link to="/Contactus">
          <li
            onClick={() => setMenu("Contact Us")}
            className={menu == "Contact Us" ? "active" : ""}
          >
            <b>Contact Us</b>
          </li>
        </Link>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" style={{ width: "40px" }} />
        <div className="navbar-search-icon">
          <Link to="/cart">
            <img src={assets.basket_icon} alt="" style={{ width: "40px" }} />
          </Link>
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign in</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="" />
            <ul className="nav-profile-dropdown">
              <li>
                <img src={assets.bag_icon} alt="" />
                <Link to={"/view/orders"}>
                  <p>Orders</p>
                </Link>
              </li>
              <hr />
              <li onClick={logOut}>
                <img src={assets.logout_icon} alt="" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
