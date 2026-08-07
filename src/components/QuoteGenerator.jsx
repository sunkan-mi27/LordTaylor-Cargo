import { motion } from "framer-motion";
import { useState } from "react";
import "../styles/quoteGenerator.css";
import {
  FaUser,
  FaBuilding,
  FaEnvelope,
  FaPhone,
  FaLocationDot,
  FaBoxOpen,
  FaWeightHanging,
  FaPlaneDeparture,
  FaFileInvoice,
} from "react-icons/fa6";

import QuoteDocument from "./QuoteDocument";

const QuoteGenerator = () => {
  const [formData, setFormData] = useState({
    customerName: "",

    company: "",

    email: "",

    phone: "",

    pickupCountry: "United Kingdom",

    pickupCity: "London",

    destinationCountry: "Nigeria",

    destinationCity: "Lagos",

    packageType: "Parcel",

    weight: "5",

    service: "Express",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="quote-generator">
      <div className="quote-glow glow-left"></div>

      <div className="quote-glow glow-right"></div>

      <div className="quote-container">
        <motion.div
          className="quote-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span>Professional Shipping Quote</span>

          <h1>Generate a Client Quotation</h1>

          <p>
            Create a beautiful shipping quotation that updates live while you
            complete the form.
          </p>
        </motion.div>

        <div className="quote-layout">
          <motion.div
            className="quote-form"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {" "}
            <div className="field">
              <label>
                <FaUser />
                Customer Name
              </label>

              <input
                type="text"
                name="customerName"
                placeholder="Olamilekan Ayanda"
                value={formData.customerName}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>
                <FaBuilding />
                Company
              </label>

              <input
                type="text"
                name="company"
                placeholder="ABC Logistics Ltd"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>
                <FaEnvelope />
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Ola@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>
                <FaPhone />
                Phone Number
              </label>

              <input
                type="text"
                name="phone"
                placeholder="+44 7123 456789"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className="double-fields">
              <div className="field">
                <label>
                  <FaLocationDot />
                  Pickup Country
                </label>

                <select
                  name="pickupCountry"
                  value={formData.pickupCountry}
                  onChange={handleChange}
                >
                  <option>United Kingdom</option>

                  <option>Nigeria</option>
                </select>
              </div>

              <div className="field">
                <label>Pickup City</label>

                <input
                  type="text"
                  name="pickupCity"
                  value={formData.pickupCity}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="double-fields">
              <div className="field">
                <label>
                  <FaLocationDot />
                  Destination Country
                </label>

                <select
                  name="destinationCountry"
                  value={formData.destinationCountry}
                  onChange={handleChange}
                >
                  <option>Nigeria</option>

                  <option>United Kingdom</option>
                </select>
              </div>

              <div className="field">
                <label>Destination City</label>

                <input
                  type="text"
                  name="destinationCity"
                  value={formData.destinationCity}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="double-fields">
              <div className="field">
                <label>
                  <FaBoxOpen />
                  Package Type
                </label>

                <select
                  name="packageType"
                  value={formData.packageType}
                  onChange={handleChange}
                >
                  <option>Documents</option>

                  <option>Parcel</option>

                  <option>Electronics</option>

                  <option>Commercial Cargo</option>
                </select>
              </div>

              <div className="field">
                <label>
                  <FaWeightHanging />
                  Weight (KG)
                </label>

                <input
                  type="number"
                  min="1"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label>
                <FaPlaneDeparture />
                Shipping Service
              </label>

              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option>Standard</option>

                <option>Express</option>

                <option>Priority Express</option>
              </select>
            </div>
          </motion.div>

          <QuoteDocument formData={formData} />
        </div>
      </div>
    </section>
  );
};

export default QuoteGenerator;
