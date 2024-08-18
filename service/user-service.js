const UserModel = require("../models/user-model");
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error')

class UserService {
    async registration(email, password, userName, lastUserName) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким почтовим адресом ${email} существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await UserModel.create({ userName, lastUserName, email, password: hashPassword, activationLink });
        mailService.sendActivationMailPHP(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        };
    }

    async login(email, password) {
        // console.log('**********************LOGIN service*****************')
        // console.log(email, password)
        // console.log('**********************LOGIN service*****************')
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Неправильний  email або пароль');
        }
        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неправильний  email або пароль');
        }
        // console.log('**********************LOGIN service token*****************')
        // console.log(email, password)
        // console.log('**********************LOGIN service token*****************')
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        };
    }

    async createUser(email, password, userName, lastUserName) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с таким почтовим адресом ${email} существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await UserModel.create({ userName, lastUserName, email, password: hashPassword, activationLink });
        return {
            user
        };
    }

    async updateUser(existingUser) {
        try {
            console.log('existingUser', existingUser);
            const { id, email, userName, lastUserName, roles, isBlocked, isAddedContent, isActivated } = existingUser.user;
            // console.log("++++++++++++++++++++++++++++++++");
            // console.log("userName", userName);
            // console.log("lastUserName", lastUserName);
            // console.log("isBlocked", isBlocked);
            // console.log("isAddedContent", isAddedContent);
            // console.log("roles", roles);
            // console.log("user email", email);
            // console.log("user id", id);
            // console.log("user isActivated", isActivated);
            // console.log("++++++++++++++++++++++++++++++++");

            // Перевіряємо, чи користувач існує в базі даних за id
            const user = await UserModel.findById(id);
            if (!user) {
                throw ApiError.BadRequest(`Пользователь с ID ${id} не найден`);
            }

            // Оновлюємо інформацію користувача
            user.userName = userName || user.userName;
            user.lastUserName = lastUserName || user.lastUserName;
            user.email = email || user.email;
            user.roles = roles || user.roles;
            user.isBlocked = isBlocked;
            user.isAddedContent = isAddedContent;
            user.isActivated = isActivated;

            // console.log('user', user);

            // Зберігаємо оновленого користувача в базі даних
            const result = await user.save();
            // console.log('result', result);

            // Повертаємо оновлену інформацію про користувача
            return {
                user: result
            };

        } catch (error) {
            console.error(`Помилка при оновленні користувача: ${error.message}`);
            throw new Error(`Не вдалося оновити користувача: ${error.message}`);
        }
    }



    async deleteUser(userId) {
        try {
            // Перевіряємо, чи користувач існує в базі даних за ID
            const user = await UserModel.findById(userId);
            // console.log('user', user)
            if (!user) {
                throw ApiError.BadRequest(`Користувача з ID ${userId} не знайдено`);
            }

            // Видаляємо користувача з бази даних
            await user.deleteOne();


            return { message: `Користувача з ID ${userId} успішно видалено` }

        } catch (error) {
            console.error(`Помилка при видаленні користувача: ${error.message}`);
            throw new Error(`Не вдалося видалити користувача: ${error.message}`);
        }
    }



    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Некоретная ссилка актівації');
        };
        user.isActivated = true;
        await user.save();
    }



    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDB = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({ ...userDto })
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {
            ...tokens,
            user: userDto
        };
    }

    async getAllUsers() {
        const users = await UserModel.find();
        console.log(users[0]._id)
        return users
    }
}

module.exports = new UserService();
