const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const bearerToken = require("express-bearer-token");

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(bearerToken());

app.get("/", (req, res) => {
  res.status(200).send("<h4>Welcome to your-api</h4>");
});

// Routes
const { authRouters } = require("./routes");

app.use("/auth", authRouters);

app.listen(PORT, () => console.log("Api Running :", PORT));
