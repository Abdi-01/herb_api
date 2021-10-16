const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bearerToken = require("express-bearer-token");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(bearerToken());

app.get("/", (req, res) => {
  res.status(200).send("<h4>Welcome to herb_api</h4>");
});

// Routes
const { authRouters, cartRouters, transactionRouter } = require("./routes");
const { productRouters } = require("./routes");
const { transactionRouters } = require("./routes");

app.use("/auth", authRouters);
app.use("/products", productRouters);
app.use("/carts", cartRouters);
// Custom Trans
app.use("/transaction", transactionRouters);
// Regular Trans
app.use("/transactions", transactionRouter);

app.listen(PORT, () => console.log("Api Running :", PORT));
