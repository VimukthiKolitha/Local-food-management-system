import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
    url,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <h2>Your Cart</h2>
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div className="cart-item-card" key={index}>
                <img
                  src={url + "/images/" + item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>Rs. {item.price}.00</p>
                  <div className="quantity-control">
                    <img
                      src={assets.remove_icon_red}
                      alt="Decrease"
                      onClick={() => removeFromCart(item._id)} // Decrease quantity by 1
                      className="quantity-btn"
                    />
                    <p>{cartItems[item._id]}</p>
                    <img
                      src={assets.add_icon_green}
                      alt="Increase"
                      onClick={() => addToCart(item._id)} // Add 1 to quantity
                      className="quantity-btn"
                    />
                  </div>
                  <p className="cart-item-total">
                    Total: Rs. {item.price * cartItems[item._id]}.00
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item._id, true)} // Remove all of this item from the cart
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>Rs. {getTotalCartAmount()}.00</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>Rs. {getTotalCartAmount() === 0 ? 0 : 150}.00</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Total</b>
            <b>
              Rs. {getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 150}
              .00
            </b>
          </div>
          <div className="cart-promocode">
            <p>If you have a promo code, Enter it here..</p>
            <div className="cart-promocode-input">
              <input type="text" placeholder="promo code" />
              <button>Submit</button>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>
            Proceed to checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
