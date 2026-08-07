import { motion } from "framer-motion";
import "../styles/quoteDocument.css";
import {
  FaFileInvoice,
  FaLocationDot,
  FaBoxOpen,
  FaWeightHanging,
  FaPlaneDeparture,
  FaDownload,
  FaPrint,
  FaEnvelope,
} from "react-icons/fa6";

const QuoteDocument = ({ formData }) => {
  const basePrice = Number(formData.weight) * 15;

  const insurance = 20;

  const serviceFee =
    formData.service === "Priority Express"
      ? 80
      : formData.service === "Express"
        ? 40
        : 15;

  const vat = Math.round((basePrice + serviceFee) * 0.075);

  const total = basePrice + insurance + serviceFee + vat;

  const [quoteId] = useState(() => {
    return `GX-${new Date().getFullYear()}-${Math.floor(
      100000 + Math.random() * 900000,
    )}`;
  });

  const today = new Date().toLocaleDateString();

  return (
    <motion.div
      className="quote-document"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="document-top">
        <div>
          <span className="company-tag">GLOBAL EXPRESS</span>

          <h2>Shipping Quotation</h2>
        </div>

        <div className="quote-meta">
          <p>
            <strong>Quote ID</strong>

            <span>{quoteId}</span>
          </p>

          <p>
            <strong>Date</strong>

            <span>{today}</span>
          </p>
        </div>
      </div>

      <div className="document-section">
        <h3>Customer Details</h3>

        <div className="document-grid">
          <div>
            <label>Customer</label>

            <p>{formData.customerName || "Not Provided"}</p>
          </div>

          <div>
            <label>Company</label>

            <p>{formData.company || "Not Provided"}</p>
          </div>

          <div>
            <label>Email</label>

            <p>{formData.email || "Not Provided"}</p>
          </div>

          <div>
            <label>Phone</label>

            <p>{formData.phone || "Not Provided"}</p>
          </div>
        </div>
      </div>
      <div className="document-section">
        <h3>Shipment Details</h3>

        <div className="document-grid">
          <div>
            <label>
              <FaLocationDot />
              Pickup
            </label>

            <p>
              {formData.pickupCity}, {formData.pickupCountry}
            </p>
          </div>

          <div>
            <label>
              <FaLocationDot />
              Destination
            </label>

            <p>
              {formData.destinationCity}, {formData.destinationCountry}
            </p>
          </div>

          <div>
            <label>
              <FaBoxOpen />
              Package Type
            </label>

            <p>{formData.packageType}</p>
          </div>

          <div>
            <label>
              <FaWeightHanging />
              Weight
            </label>

            <p>{formData.weight} KG</p>
          </div>

          <div>
            <label>
              <FaPlaneDeparture />
              Shipping Service
            </label>

            <p>{formData.service}</p>
          </div>

          <div>
            <label>Transit Time</label>

            <p>
              {formData.service === "Priority Express"
                ? "2 - 3 Days"
                : formData.service === "Express"
                  ? "4 - 6 Days"
                  : "7 - 10 Days"}
            </p>
          </div>
        </div>
      </div>

      <div className="document-section">
        <h3>Pricing Breakdown</h3>

        <div className="price-breakdown">
          <div className="price-row">
            <span>Shipping Cost</span>

            <strong>£{basePrice}</strong>
          </div>

          <div className="price-row">
            <span>Service Fee</span>

            <strong>£{serviceFee}</strong>
          </div>

          <div className="price-row">
            <span>Insurance</span>

            <strong>£{insurance}</strong>
          </div>

          <div className="price-row">
            <span>VAT (7.5%)</span>

            <strong>£{vat}</strong>
          </div>

          <div className="price-row total">
            <span>Total Amount</span>

            <strong>£{total}</strong>
          </div>
        </div>
      </div>
      <div className="document-footer">
        <div className="document-note">
          <FaFileInvoice />

          <div>
            <h4>Quotation Notice</h4>

            <p>
              This quotation is valid for 14 days from the date of issue. Final
              pricing may change depending on the actual package dimensions,
              customs inspection, restricted items, or additional logistics
              services.
            </p>
          </div>
        </div>

        <div className="document-actions">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="download-btn"
          >
            <FaDownload />
            Download PDF
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="print-btn"
          >
            <FaPrint />
            Print Quote
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="email-btn"
          >
            <FaEnvelope />
            Email Quote
          </motion.button>
        </div>

        <div className="signature">
          <div>
            <h4>Global Express Logistics</h4>

            <p>International Freight • Air Cargo • Sea Cargo</p>
          </div>

          <span>Thank you for choosing Global Express.</span>
        </div>
      </div>
    </motion.div>
  );
};

export default QuoteDocument;
