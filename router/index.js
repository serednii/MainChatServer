const Router = require('express').Router;
const userController = require('../controllers/user-Controller')
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware')
const { graphqlHTTP } = require('express-graphql');
const schema = require('../schemaLink/schemaLink');

const router = new Router();

router.post('/registration',
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }).withMessage('Password must be between 3 and 32 characters'),
    userController.registration
)

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

module.exports = router