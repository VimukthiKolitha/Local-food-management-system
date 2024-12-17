import React, { useState } from "react";
import "../Inventorystyle/Inventoryform.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ url }) => {
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Central Province",
    quantity: "",
  });

  const [errors, setErrors] = useState({});

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    let errorMessages = { ...errors };

    // Validation for name
    if (name === "name") {
      if (!/^[a-zA-Z\s]*$/.test(value)) {
        errorMessages[name] = "Cannot enter special characters";
      } else {
        delete errorMessages[name]; // Remove error if validation passes
      }
    }

    // Validation for quantity
    if (name === "quantity") {
      if (!/^\d*$/.test(value) || value > 30) {
        errorMessages[name] = "Quantity must be a number and less than 30";
      } else {
        delete errorMessages[name];
      }
    }

    // Validation for price
    if (name === "price") {
      if (value <= 0) {
        errorMessages[name] = "Price must be greater than 0";
      } else {
        delete errorMessages[name];
      }
    }

    setErrors(errorMessages);
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    // Check for validation errors
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", Number(data.price));
    formData.append("category", data.category);
    formData.append("quantity", Number(data.quantity));
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, formData);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "Central Province",
          quantity: "",
        });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add food item");
      console.error("Error adding food item:", error);
    }
  };

  return (
    <div className="add1">
      <form className="flex-col" onSubmit={onSubmitHandler} style={{width:"500px"}}>
        <div className="add-img-upload flex-col">
          <p style={{color:"black"}}>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product name</p>
          <input
            onChange={onChangeHandler}
            value={data.name}
            type="text"
            name="name"
            placeholder="Product name here"
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="add-product-description flex-col">
          <p>Product description</p>
          <textarea
            onChange={onChangeHandler}
            value={data.description}
            name="description"
            rows="6"
            placeholder="Write description here"
            required
          ></textarea>
          {errors.description && (
            <span className="error-message">{errors.description}</span>
          )}
        </div>

        <div className="add-category-price">
        <div className="add-category flex-col">
            <p>Food category</p>
            <select
              required
            >
              <option value="Sweet">Sweets</option>
              <option value="Curry">Curry</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Product Price (Rs.)</p>
            <input
              onChange={onChangeHandler}
              value={data.price}
              type="number"
              name="price"
              style={{width:"150px"}}
              placeholder="350"
              required
            />
            {errors.price && (
              <span className="error-message">{errors.price}</span>
            )}
          </div>

          <div className="add-quantity flex-col">
            <p>Quantity</p>
            <input
              onChange={onChangeHandler}
              value={data.quantity}
              type="number"
              name="quantity"
              placeholder="30"
              required
            />
            {errors.quantity && (
              <span className="error-message">{errors.quantity}</span>
            )}
          </div>
        </div>
        <div className="add-category-price">
        <div className="add-category flex-col">
            <p>Product category</p>
            <select
              onChange={onChangeHandler}
              name="category"
              value={data.category}
              required
            >
              <option value="Central Province">Central Province</option>
              <option value="Eastern Province">Eastern Province</option>
              <option value="North Central Province">
                North Central Province
              </option>
              <option value="North Western Province">
                North Western Province
              </option>
              <option value="Northern Province">Northern Province</option>
              <option value="Sabaragamuwa Province">
                Sabaragamuwa Province
              </option>
              <option value="Southern Province">Southern Province</option>
              <option value="Uva Province">Uva Province</option>
              <option value="Western Province">Western Province</option>
            </select>
          </div>
          <div className="add-category flex-col">
            <p>Expire Date</p>
              <input
                type="date"
                name="Date"
              />
            </div>
        </div>
        <button type="submit" className="add-btn">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default Add;
