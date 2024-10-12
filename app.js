require('dotenv').config();
const express = require('express');
const http = require("http");//socket
const routeSocket = require("./server_socket/route");

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

const server = http.createServer(app);
// setInterval(() => checkTimeUsers(), 1000 * 10)

const { init } = require('./server_socket/io');  // Імпортуємо новий файл
const io = init(server);  // Ініціалізуємо сервер з io

const handleSockets = require('./server_socket/socketHandlers');
handleSockets(io);  // Передаємо io

// Middleware для обробки помилок
app.use(errorMiddleware);

// Старт сервера
const start = async () => {
    try {
        server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
    } catch (e) {
        console.log('Server Error:', e);
    }
}

start();



// require('dotenv').config();
// const express = require('express');
// const http = require("http"); // для socket
// const routeSocket = require("./server_socket/route");

// const cors = require('cors');
// const { graphqlHTTP } = require('express-graphql');
// const cookieParser = require('cookie-parser');
// const mongoose = require('mongoose');
// const router = require('./server_auth/router/index');
// const errorMiddleware = require('./server_auth/middlewares/error-middleware');
// const schema = require('./server_data/schemaLink/schemaLink');
// const authMiddleware = require('./server_auth/middlewares/auth-middleware');

// const PORT = process.env.PORT || 7000;
// const app = express();

// // Підключення до MongoDB
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.log(`Connection error: ${err}`));

// app.use(express.json());
// app.use(cookieParser());
// app.use(cors({
//     credentials: true,
//     origin: [process.env.CLIENT_URL, process.env.CLIENT_URL1, process.env.CLIENT_URL2]
// }));

// // GraphQL Middleware
// // app.use('/graphql', authMiddleware, graphqlHTTP({
// //     schema,
// //     graphiql: true, // Включення GraphiQL для зручності розробки
// // }));

// app.use('/graphql', graphqlHTTP({
//     schema,
//     graphiql: true, // Включення GraphiQL для зручності розробки
// }));

// // API маршрути
// app.use('/api', router);

// const server = http.createServer(app); // Створюємо HTTP-сервер для роботи з Socket.io

// const { init } = require('./server_socket/io');  // Імпортуємо файл для ініціалізації Socket.io
// const io = init(server);  // Ініціалізуємо сервер з io

// const handleSockets = require('./server_socket/socketHandlers');
// handleSockets(io);  // Передаємо io для обробки подій сокета

// // Middleware для обробки помилок
// app.use(errorMiddleware);

// // Старт сервера
// const start = async () => {
//     try {
//         server.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`)); // Використовуємо сервер для Socket.io
//     } catch (e) {
//         console.log('Server Error:', e);
//     }
// }

// start();
