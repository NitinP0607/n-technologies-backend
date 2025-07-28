const express = require("express");
const cors = require("cors");
require("dotenv").config();

const backendInternRoute = require("./routes/backendInternRoute");
const digitalMarketingRoute = require("./routes/digitalMarketingIntern");
const frontendInternRoute = require("./routes/frontendIntern"); 
const serviceRoute = require("./routes/service");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", backendInternRoute);
app.use("/api", digitalMarketingRoute);
app.use("/api", frontendInternRoute);
app.use("/api", serviceRoute);   

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
