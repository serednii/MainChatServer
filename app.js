//index.js
require('dotenv').config()
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const router = require('./router/index')
const errorMiddleware = require('./middlewares/error-middleware');

const PORT = process.env.PORT || 7000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}))

app.use('/api', router);
app.use(errorMiddleware);// має іти послідній в списку

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://seredniimykola:h5ZgrweHvwejowJY@test.2hvsgym.mongodb.net/jwt?retryWrites=true&w=majority&appName=test'), { useNewUrlParser: true, useUnifiedTopology: true };
        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}/graphql`))
    } catch (e) {
        console.log(e)
    }
}

start()