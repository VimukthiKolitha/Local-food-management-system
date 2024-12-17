import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image, unit }) => {
  const { addToCart, url } = useContext(StoreContext);

  return (
    <div className="food-item">
      <Link to={`/food/${id}`}>
        <div className="food-item-img-container">
          <img
            className="food-item-image"
            src={`http://localhost:4000/images/${image}`}
            alt={name}
          />
        </div>
      </Link>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Rating" />
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price-container">
          <div className="food-item-price-info">
            <p className="food-item-price">Rs.{price}.00</p>
            <p className="food-item-include">{unit}</p>
          </div>
          <button className="add-to-cart-btn" onClick={() => addToCart(id)}>
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
