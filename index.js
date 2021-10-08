const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.status(200).send('<h4>Welcome to herb_api</h4>');
});

const { productRouters } = require('./controllers_routers/routers');

app.use('/products', productRouters);

app.listen(PORT, () => console.log('Api Running at PORT:', PORT));
