const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const UserRoute = require('./routes/UserRoutes');
const CustomerRoute = require('./routes/CustomerRoutes');
const ProductRoutes = require('./routes/ProductRoutes');
const OrderRoute = require('./routes/OrderRoutes');

require('dotenv').config();
const app = express();
bodyParser.json();
bodyParser.urlencoded({ extended: false });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log('Database Connected...');
    }).catch((error=>{
    console.log(error);
}));

app.listen(process.env.PORT, () => {
    console.log(`Server started & running on port ${process.env.PORT}`);
});
app.use('/api/v1/users',UserRoute);
app.use('/api/v1/customers',CustomerRoute);
app.use('/api/v1/products',ProductRoutes);
app.use('/api/v1/orders',OrderRoute);