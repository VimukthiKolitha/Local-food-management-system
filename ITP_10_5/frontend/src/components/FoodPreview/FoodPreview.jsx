import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import "./FoodPreview.css";

const FoodPreview = () => {
  const { food_list, addToCart } = useContext(StoreContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const foodItem = food_list.find((item) => item._id === id);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleQuantityChange = (e) => {
    const value = e.target.value;

    if (value === "" || /^[1-9]\d*$/.test(value)) {
      setQuantity(Number(value));
      setError("");
    } else {
      setError("Please enter a valid quantity (positive whole numbers only).");
    }
  };

  // Update the handleAddToCart function to pass quantity to addToCart
  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(foodItem._id, quantity); // Pass the quantity to addToCart
      navigate("/cart");
    } else {
      setError("Quantity must be greater than 0.");
    }
  };

  return (
    <div className="food-preview-container">
      <img
        src={`http://localhost:4000/images/${foodItem.image}`}
        alt={foodItem.name}
        className="food-preview-image"
      />
      <div className="food-preview-info">
        <h2>{foodItem.name}</h2>
        <p>{foodItem.description}</p>
        <p className="food-preview-price">Price: Rs.{foodItem.price}.00</p>

        <div className="quantity-selector">
          <button
            onClick={() =>
              setQuantity((prevQuantity) => Math.max(1, prevQuantity - 1))
            }
          >
            -
          </button>
          <input
            type="text"
            value={quantity}
            onChange={handleQuantityChange}
            className="quantity-input"
          />
          <button
            onClick={() => setQuantity((prevQuantity) => prevQuantity + 1)}
          >
            +
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add {quantity} to Cart
        </button>
      </div>
    </div>
  );
};

export default FoodPreview;
