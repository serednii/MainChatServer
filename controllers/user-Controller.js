const userService = require('../service/user-service');

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (e) {
            console.log(e);
            next(e); // don't forget to call next with the error to handle it properly
        }
    }

    async login(req, res, next) {
        try {
            // login logic
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            // logout logic
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await useService.activate(activationLink);
            return res.redirect("https:goggle.com")
            // return res.redirect(process.env.CLIENT_URL)

        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            // refresh logic
        } catch (e) {
            console.log(e);
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            res.json(['123', '456']);
        } catch (e) {
            console.log(e);
            next(e);
        }
    }
}

module.exports = new UserController();
