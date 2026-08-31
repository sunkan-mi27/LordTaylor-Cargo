import { motion } from "framer-motion";
import "../styles/testimonials.css";
import {
  FaArrowRight,
  FaStar,
  FaQuoteLeft,
  FaCheckCircle,
} from "react-icons/fa";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Fashion Retailer",
    country: "Lagos → London",
    initials: "SJ",
    rating: 5,
    delivery: "Delivered in 3 Days",
    review:
      "The entire process was smooth. Tracking updates were accurate and my parcels arrived exactly as promised.",
  },

  {
    name: "David Williams",
    role: "Business Owner",
    country: "Abuja → Manchester",
    initials: "DW",
    rating: 5,
    delivery: "24 Shipments Completed",
    review:
      "Reliable logistics partner for our business. Excellent communication and professional handling every time.",
  },

  {
    name: "Grace Thompson",
    role: "Student",
    country: "Ibadan → Birmingham",
    initials: "GT",
    rating: 5,
    delivery: "Delivered in 4 Days",
    review:
      "Sending packages to my family has never been easier. Fast delivery and complete peace of mind.",
  },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-glow glow-left"></div>

      <div className="testimonials-glow glow-right"></div>

      <div className="testimonials-container">
        <motion.div
          className="testimonials-header"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="testimonials-tag">Trusted By Our Customers</span>

          <h2>Real Stories. Real Deliveries.</h2>

          <p>
            Businesses and families trust us every day to move shipments safely
            between Nigeria and the United Kingdom.
          </p>
        </motion.div>

        <div className="trust-score">
          <div>
            <h3>98.9%</h3>

            <span>Customer Satisfaction</span>
          </div>

          <div>
            <h3>24K+</h3>

            <span>Successful Deliveries</span>
          </div>

          <div>
            <h3>4.9/5</h3>

            <span>Average Rating</span>
          </div>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,

                delay: index * 0.15,
              }}
              whileHover={{
                y: -10,
              }}
            >
              <div className="quote-icon">
                <FaQuoteLeft />
              </div>

              <div className="testimonial-top">
                <div className="avatar">{testimonial.initials}</div>

                <div>
                  <h3>{testimonial.name}</h3>

                  <span>{testimonial.role}</span>
                </div>
              </div>

              <div className="stars">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>

              <p className="review">"{testimonial.review}"</p>

              <div className="delivery-badge">
                <FaCheckCircle />

                <span>{testimonial.delivery}</span>
              </div>

              <div className="testimonial-footer">
                <span>{testimonial.country}</span>
              </div>

              <div className="testimonial-glow"></div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="testimonials-cta"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="cta-content">
            <h3>Join Thousands Of Happy Customers</h3>

            <p>
              Experience fast, secure and transparent shipping between Nigeria
              and the United Kingdom.
            </p>
          </div>

          <button className="cta-btn">
            Start Shipping
            <FaArrowRight />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
