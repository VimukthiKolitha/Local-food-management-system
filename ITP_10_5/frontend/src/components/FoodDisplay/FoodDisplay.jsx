import React, { useContext, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import FoodFilter from "../FoodFilter/FoodFilter";

const FoodDisplay = ({ category, searchTerm, setSearchTerm }) => {
  const { food_list } = useContext(StoreContext);

  // State for price range filter
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // State for the message when no items match the search
  const [noMatchMessage, setNoMatchMessage] = useState("");

  // Filtering based
  const filteredFoodList = food_list.filter((item) => {
    const matchesCategory = category === "All" || category === item.category;
    const matchesSearchTerm = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPrice =
      (minPrice === "" || item.price >= minPrice) &&
      (maxPrice === "" || item.price <= maxPrice);

    return matchesCategory && matchesSearchTerm && matchesPrice;
  });

  // Set no match message if the filtered list is empty
  React.useEffect(() => {
    if (filteredFoodList.length === 0 && searchTerm) {
      setNoMatchMessage("Your search does not match any item.");
    } else {
      setNoMatchMessage("");
    }
  }, [filteredFoodList, searchTerm]);

  return (
    <div className="food-display" id="food-display">
      {/* Include the FoodFilter component above the header */}
      <FoodFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
      />
      <h2>Top Dishes Near You</h2>

      {/* Display message when no items match the search */}
      {noMatchMessage && (
        <div className="no-match-message">{noMatchMessage}</div>
      )}

      {/* Display Filtered Food List */}
      <div className="food-display-list">
        {filteredFoodList.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
            unit={item.unit}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;
