import express from 'express';
import mongoose from'mongoose';
import cors from'cors';
import bodyParser from'body-parser';
import 'dotenv/config'; // Correct import for dotenv

import UserRoute from './routes/UserRoutes.mjs';
import CustomerRoute from './routes/CustomerRoutes.mjs';
import ProductRoutes from './routes/ProductRoutes.mjs';
import OrderRoute from './routes/OrderRoutes.mjs';

const app = express();
bodyParser.json();
bodyParser.urlencoded({ extended: false });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors({origin: 'http://localhost:5173', credentials: true }));

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