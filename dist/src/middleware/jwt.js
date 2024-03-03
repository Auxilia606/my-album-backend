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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtMiddleware = void 0;
const user_1 = require("../controllers/user");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("./constants");
const jwtMiddleware = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = ctx.cookies.get(constants_1.AUTH_COOKIE_NAME);
    if (!token) {
        return yield next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, {
            complete: false,
        });
        if (typeof decoded === 'string' || !(decoded === null || decoded === void 0 ? void 0 : decoded.exp))
            return yield next();
        const user = yield (0, user_1.findByUserEmail)(decoded.email);
        if (!user)
            return yield next();
        ctx.state.user = user;
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp - now > 60 * 60 * 24)
            return yield next();
        const newToken = yield (0, user_1.generateToken)(user.email, user.nickname);
        ctx.cookies.set(constants_1.AUTH_COOKIE_NAME, newToken, constants_1.cookieOption);
        return yield next();
    }
    catch (error) {
        ctx.throw(500, error);
    }
});
exports.jwtMiddleware = jwtMiddleware;
