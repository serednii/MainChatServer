const Router = require('express').Router;
const userController = require('../controllers/user-Controller')
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware')

const router = new Router();

router.post('/registration',
    body("email").isEmail(),
    body("password").isLength({ min: 3, max: 32 }).withMessage('Password must be between 3 and 32 characters'),
    userController.registration
)

// router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router