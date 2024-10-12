const Router = require('express').Router;
const userController = require('../server_auth/controllers/user-Controller')
const { body } = require('express-validator');
const authMiddleware = require('../server_auth/middlewares/auth-middleware')
const { graphqlHTTP } = require('express-graphql');
const schema = require('../server_data/schemaLink/schemaLink');

const router = new Router();

router.post('/registration',
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }).withMessage('Password must be between 3 and 32 characters'),
    userController.registration
)

// router.post('/graphql', authMiddleware, graphqlHTTP({
//     schema,
//     graphiql: true, // Включення GraphiQL для зручності розробки
// }));

router.post('/graphql', graphqlHTTP({
    schema,
    graphiql: true, // Включення GraphiQL для зручності розробки
}));

router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.post('/update', userController.updateUser);

router.post('/create', userController.createUser);
router.post('/delete', userController.deleteUser);
router.get('/users', authMiddleware, userController.getUsers);
router.get("/", (req, res) => {//socket
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    res.send("Socket route works!");
});
module.exports = router