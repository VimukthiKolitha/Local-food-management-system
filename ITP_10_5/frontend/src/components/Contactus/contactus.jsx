import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import "./contactus.css";
import background from "./images/contactusback.jpg";

const Contactus = () => {

  const boxStyle = {
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '20px',
    backgroundColor: 'rgb(224, 228, 228)',
    margin: '20px 0',
    width: '450px', 
    height: '200px'
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '450px',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    backgroundColor: '#f9f9f9'
  };

  return (
    <div className='background'>
      <h1><span className='topic'>Connect</span> with Our</h1>
      <h1>Team of Experts</h1>

      <div className='container'>
        {/* Updated contact information section with icons */}
        <div style={boxStyle} >
          <h2>Contact Information</h2>
          <p>
            <FontAwesomeIcon icon={faPhone} style={{ marginRight: '10px' }} />
            Contact Number: 0774582236
          </p>
          <p>
            <FontAwesomeIcon icon={faEnvelope} style={{ marginRight: '10px' }} />
            Email: localhelaya@gmail.com
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} style={{ marginRight: '10px' }} />
            Location: 33/2 Aluthkade, Colombo, Sri Lanka
          </p>
        </div>

        {/* Contact form section */}
        <div style={formStyle}>
          <form className='form'>
            <label>
              Name:
              <input type="text" name="name" placeholder="Enter your name" />
            </label>
            <label>
              Email:
              <input type="email" name="email" placeholder="Enter your email" />
            </label>
            <label>
              Contact Number:
              <input type="tel" name="contact" placeholder="Enter your contact number" />
            </label>
            <label>
              Description:
              <textarea name="description" placeholder="Enter your message" rows="4"></textarea>
            </label>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contactus;
