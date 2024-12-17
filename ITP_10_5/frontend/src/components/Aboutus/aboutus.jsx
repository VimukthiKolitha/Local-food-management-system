import React from "react";
import "./aboutus.css";
import pic1 from "./images/pic1.jpg";
import pic2 from "./images/pic2.jpg";
import pic3 from "./images/pic3.jpg";
import pic4 from "./images/pic4.jpg";
import pic5 from "./images/pic5.png";
import pic6 from "./images/pic6.jpg";
import pic7 from "./images/pic7.jpg";

const AboutUs = () => {
  const frontImages = [pic1, pic2, pic3, pic4, pic5, pic6, pic7];

  const backDetails = [
    { id: "IT22273680", name: "Jayanga", Creator_of: "Inventory management system"},
    { id: "IT22273208", name: "Sithija", Creator_of: "Customer management system" },
    { id: "IT22559968", name: "Gihara", Creator_of: "Supply management system" },
    { id: "IT22268426", name: "Irushi", Creator_of: "Order management system"},
    { id: "IT22270788", name: "Hashan", Creator_of: "Payment cart management system"},
    { id: "IT22116710", name: "Divyangi", Creator_of: "Payment management system" },
    { id: "IT2291714", name: "Vimukthi", Creator_of: "Delivery management system"},
  ];

  return (
    <div>
      <div className="description-box">
        <h2>Discover District Delicacies with Our Food Delivery App!</h2>
        <p>
          Taste the distinct flavors of your district with our curated selection of unique and local foods delivered right to your doorstep. From hidden gems to well-loved favorites, explore a variety of dishes that celebrate the culinary diversity of your area. Whether you're craving traditional comfort foods or adventurous flavors, our app connects you with exclusive dining experiences tailored to your district's palate. Embrace local flavors, support small businesses, and satisfy your cravings with ease. Download now and start savoring the essence of your district, one delicious bite at a time!
        </p>
      </div>
      <h2>Creators of web site</h2>
      <div className="box-container">
        {frontImages.map((frontImage, index) => (
          <div key={index} className="card">
            <div className="flip-card">
              <div className="card-content front">
                {/* Front content: Different image for each card */}
                <img
                  src={frontImage} // Front image
                  alt={`Front Pic ${index + 1}`}
                  className="flip-card-image"
                />
              </div>
              <div className="card-content back">
                {/* Back content: Details about the image */}
                <div className="back-content">
                  <h3>{backDetails[index].name}</h3>
                  <p>ID: {backDetails[index].id}</p>
                  <p>Creator of: {backDetails[index].Creator_of}</p>
                  <p>{backDetails[index].details}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
