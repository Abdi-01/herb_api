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
const { authRouters, cartRouters } = require("./routes");
const { productRouters } = require("./controllers_routers/routers");

app.use("/auth", authRouters);
app.use("/products", productRouters);
app.use("/carts", cartRouters);

app.listen(PORT, () => console.log("Api Running :", PORT));
