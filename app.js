require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./server_auth/router/index');
const errorMiddleware = require('./server_auth/middlewares/error-middleware');
const schema = require('./server_data/schemaLink/schemaLink');
const authMiddleware = require('./server_auth/middlewares/auth-middleware');

const PORT = process.env.PORT || 7000;
const app = express();

// Підключення до MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(`Connection error: ${err}`));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: [process.env.CLIENT_URL, process.env.CLIENT_URL1, process.env.CLIENT_URL2]
}));

// GraphQL Middleware
// app.use('/graphql', authMiddleware, graphqlHTTP({
//     schema,
//     graphiql: true, // Включення GraphiQL для зручності розробки
// }));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Включення GraphiQL для зручності розробки
}));

// API маршрути
app.use('/api', router);

// Middleware для обробки помилок
app.use(errorMiddleware);

// Старт сервера
const start = async () => {
    try {
        app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
    } catch (e) {
        console.log('Server Error:', e);
    }
}

start();
