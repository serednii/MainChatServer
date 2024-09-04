
const { validationResult } = require('express-validator');
const UserService = require('../service/user-service')
const ApiError = require('../exceptions/api-error')

class UserController {
    async registration(req, res, next) {
        try {
            console.log('------------------')
            console.log(req.body)

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка при валідації', errors.array()))
            }
            const { email, password, userName, lastUserName } = req.body;
            console.log('**********************LOGIN*****************')
            console.log(email, password, userName, lastUserName)
            console.log('**********************LOGIN*****************')

            const userData = await UserService.registration(email, password, userName, lastUserName);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true });
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e); // don't forget to call next with the error to handle it properly
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            console.log('**********************LOGIN*****************')
            console.log(email, password)
            console.log('**********************LOGIN*****************')

            const userData = await UserService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async createUser(req, res, next) {
        try {
            console.log('------------------')
            console.log(req.body)

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка при валідації', errors.array()))
            }
            const { email, password, userName, lastUserName } = req.body;
            const userData = await UserService.createUser(email, password, userName, lastUserName);
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e); // don't forget to call next with the error to handle it properly
        }
    }

    async updateUser(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка при валідації', errors.array()))
            }
            const userData = await UserService.updateUser(req.body);
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e); // don't forget to call next with the error to handle it properly
        }
    }


    async deleteUser(req, res, next) {
        // console.log(req.body.id)
        try {
            const userData = await UserService.deleteUser(req.body.id);
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e); // don't forget to call next with the error to handle it properly
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await UserService.logout(refreshToken)
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect(process.env.CLIENT_REDIRECT)
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {

        console.log('**********************refresh*****************')
        console.log(req.body)
        console.log(req.cookies)

        console.log('**********************refresh*****************')
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true });
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserController();
