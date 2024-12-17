import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./editPost.css";
import "../deliveryStyle/deliveryform.css"
import { toast } from "react-toastify";

const EditPosts = () => {
  const [formData, setFormData] = useState({
    DeliveryId: "",
    DeliveryPerson: "",
    Locaton: "",
    Date: "",
  });
  const [errors, setErrors] = useState({});
  const [isDateValid, setIsDateValid] = useState(true); // Separate state for date validity
  const navigate = useNavigate();
  const { id } = useParams(); // Get the id from the URL

  const alphaOnly = /^[a-zA-Z\s]*$/;
  const alphaNumOnly = /^[a-zA-Z0-9\s]*$/;

  useEffect(() => {
    // Fetch the existing post data
    axios
      .get(`http://localhost:4000/api/delivery/delivery/${id}`)
      .then((res) => {
        if (res.data.success) {
          setFormData({
            DeliveryId: res.data.delivery.DeliveryId,
            DeliveryPerson: res.data.delivery.DeliveryPerson,
            Locaton: res.data.delivery.Locaton,
            Date: res.data.delivery.Date,
          });
        }
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let error = "";

    // Update form data
    setFormData({ ...formData, [name]: value });

    // Validation logic
    if (name === "DeliveryId" && !alphaNumOnly.test(value)) {
      error = "Delivery Id should contain only alphanumeric characters.";
    } else if (name === "Locaton" && !alphaOnly.test(value)) {
      error = "Invalid characters in Location.";
    } else if (name === "Date") {
      const today = new Date();
      const twoMonthsFromNow = new Date(today.setMonth(today.getMonth() + 2))
        .toISOString()
        .split("T")[0];
      if (
        value &&
        (value <= new Date().toISOString().split("T")[0] ||
          value > twoMonthsFromNow)
      ) {
        error = "Date must be within two months and in the future.";
        setIsDateValid(false); // Set date invalid if conditions are not meet
      } else {
        setIsDateValid(true); // Set date valid if conditions are meet
      }
    }

    // Update errors
    setErrors({ ...errors, [name]: error });
  };

  const validateForm = () => {
    const { DeliveryId, DeliveryPerson, Locaton, Date } = formData;
    let formErrors = {};
    let formIsValid = true;

    if (!DeliveryId) {
      formIsValid = false;
      formErrors["DeliveryId"] = "Delivery Id is required.";
    }
    if (!DeliveryPerson) {
      formIsValid = false;
      formErrors["DeliveryPerson"] = "Delivery Person is required.";
    }
    if (!Locaton) {
      formIsValid = false;
      formErrors["Locaton"] = "Location is required.";
    }
    if (!Date || !isDateValid) {
      // Check date is valid
      formIsValid = false;
      formErrors["Date"] = !Date
        ? "Date is required."
        : "Invalid date selection.";
    }

    setErrors(formErrors);
    return formIsValid;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    axios
      .put(`http://localhost:4000/api/delivery/delivery/update/${id}`, formData)
      .then((res) => {
        if (res.data.success) {
          setFormData({
            DeliveryId: "",
            DeliveryPerson: "",
            Locaton: "",
            Date: "",
          });
          setErrors({});
          navigate("/delivery/list");
          toast.success("Delivery updated successfull!")
        }
      });
  };

  return (
    <div>
      <div className="delivery-container">
      <h1 style={{ textAlign: "center", marginTop: "20px" }}>Edit Delivery</h1>
        <form onSubmit={onSubmit}>
          <div className="row mb-3">
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                name="DeliveryId"
                placeholder="Enter Delivery Id"
                value={formData.DeliveryId}
                
              />
              {errors.DeliveryId && (
                <div className="delivery-text-danger">{errors.DeliveryId}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-10">
              <select
                className="form-control"
                name="DeliveryPerson"
                value={formData.DeliveryPerson}
                onChange={handleChange}
              >
                <option value="">Select Delivery Person</option>
                <option value="">Select Delivery Person</option>
                <option value="G.R vimukthi kolitha">G.R vimukthi kolitha</option>
                <option value="P.L kumari jayawardana">P.L kumari jayawardana</option>
                <option value="G.E hashan buddika">G.E hashan buddika</option>
                <option value="W.K jayanga pabasara">W.K jayanga pabasara</option>
              </select>
              {errors.DeliveryPerson && (
                <div className="delivery-text-danger">{errors.DeliveryPerson}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                name="Locaton"
                placeholder="Enter Location"
                value={formData.Locaton}
                onChange={handleChange}
              />
              {errors.Locaton && (
                <div className="delivery-text-danger">{errors.Locaton}</div>
              )}
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-sm-10">
              <input
                type="date"
                className="form-control"
                name="Date"
                value={formData.Date}
                onChange={handleChange}
              />
              {errors.Date && <div className="delivery-text-danger">{errors.Date}</div>}
            </div>
          </div>
            <button
              type="submit"
              className="addDeliveryBtn"
              disabled={!isDateValid}
            >
              Submit
            </button>{" "}
        </form>
      </div>
    </div>
  );
};

export default EditPosts;
