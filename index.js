const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Sample Data ---
let products = [
  { id: 1, name: "Laptop Pro", category: "electronics", available: true },
  { id: 2, name: "Phone X", category: "electronics", available: false },
  { id: 3, name: "Headphones", category: "accessories", available: true },
];

let orders = {
  12345: { status: "Shipped", delivery_date: "2025-08-22" },
  67890: { status: "Processing", delivery_date: "2025-08-25" },
};

let shipments = {
  98765: { status: "In Transit", expected_delivery: "2025-08-23" },
  12345: { status: "Delivered", delivered_on: "2025-08-18" },
};

// --- Endpoints ---

// Search products
app.get("/products", (req, res) => {
  const query = req.query.q?.toLowerCase() || "";
  const result = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
  );
  res.json(result.length ? result : { message: "No products found" });
});

// Check order status
app.get("/orders/status", (req, res) => {
  const { order_id } = req.query;
  if (!order_id || !orders[order_id]) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json({ order_id, ...orders[order_id] });
});

// Track shipment
app.get("/shipments/track", (req, res) => {
  const { tracking_id } = req.query;
  if (!tracking_id || !shipments[tracking_id]) {
    return res.status(404).json({ error: "Shipment not found" });
  }
  res.json({ tracking_id, ...shipments[tracking_id] });
});

// Change delivery date
app.post("/orders/change-date", (req, res) => {
  const { order_id, new_date } = req.body;
  if (!order_id || !orders[order_id]) {
    return res.status(404).json({ error: "Order not found" });
  }
  orders[order_id].delivery_date = new_date;
  res.json({ order_id, message: `Delivery date updated to ${new_date}` });
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ E-commerce API running on http://localhost:${PORT}`);
});
