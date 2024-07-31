
require('dotenv').config()
const express = require('express');
const router = required('./router/index.js')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose')
const { listenerCount } = require('process');
const PORT = process.env.PORT || 5000;
const app = express()

app.use(express.json())
app.use(cookieParser());
app.use(cors())
app.use('./api', router)

const start = async () => {
    try {
        await mongoose.connect('mongodb+srv://seredniimykola:h5ZgrweHvwejowJY@test.2hvsgym.mongodb.net/Link-data?retryWrites=true&w=majority&appName=test'), { useNewUrlParser: true, useUnifiedTopology: true };
        // await mongoose.connect(process.env.BD_URL, {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true
        // })
        app.listen(PORT, () => console.log('Server started on PORT ' + PORT))
    } catch (e) {
        console.log(e)
    }
}

start()