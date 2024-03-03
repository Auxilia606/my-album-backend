"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkNickName = exports.checkEmail = exports.logout = exports.getUserPhotos = exports.check = exports.login = exports.register = void 0;
const _middleware_1 = require("../middleware");
const _models_1 = require("../models");
const user_1 = require("./user");
const register = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, nickname, password } = ctx.request.body;
    try {
        const exists = yield (0, user_1.findByUserEmail)(email);
        if (exists) {
            ctx.status = 409;
            return;
        }
        const hashedPassword = yield (0, user_1.hashPassword)(password);
        const user = new _models_1.User({
            email,
            nickname,
            password: hashedPassword,
        });
        yield user.save();
        const data = user.toJSON();
        delete data.password;
        ctx.body = data;
    }
    catch (error) {
        ctx.throw(500, error);
    }
});
exports.register = register;
const login = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = ctx.request.body;
    if (!email || !password) {
        ctx.status = 401;
        return;
    }
    try {
        const user = yield (0, user_1.findByUserEmail)(email);
        if (!user) {
            ctx.status = 401;
            return;
        }
        const valid = yield (0, user_1.checkPassword)(password, user.password);
        if (!valid) {
            ctx.status = 401;
            return;
        }
        const data = user.toJSON();
        delete data.password;
        const token = yield (0, user_1.generateToken)(user.email, user.nickname);
        ctx.body = Object.assign(Object.assign({}, data), { token });
    }
    catch (error) {
        ctx.throw(500, error);
    }
});
exports.login = login;
const check = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = ctx.state;
    if (!user) {
        ctx.status = 401;
        return;
    }
    ctx.body = user;
});
exports.check = check;
const getUserPhotos = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = ctx.state;
    if (!user) {
        ctx.status = 401;
        return;
    }
    ctx.body = { photos: user.photos };
});
exports.getUserPhotos = getUserPhotos;
const logout = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.cookies.set(_middleware_1.AUTH_COOKIE_NAME);
    ctx.status = 204;
});
exports.logout = logout;
const checkEmail = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = ctx.request.body;
    try {
        const exists = Boolean(yield (0, user_1.findByUserEmail)(email));
        ctx.body = { exists };
    }
    catch (error) {
        ctx.throw(500, error);
    }
});
exports.checkEmail = checkEmail;
const checkNickName = (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const { nickname } = ctx.request.body;
    try {
        const exists = Boolean(yield (0, user_1.findByUserNickname)(nickname));
        ctx.body = { exists };
    }
    catch (error) {
        ctx.throw(500, error);
    }
});
exports.checkNickName = checkNickName;
