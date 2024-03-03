"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const auth_1 = require("../controllers/auth");
const _middleware_1 = require("../middleware");
const koa_router_1 = __importDefault(require("koa-router"));
exports.auth = new koa_router_1.default();
exports.auth.post('/register', auth_1.register);
exports.auth.post('/login', auth_1.login);
exports.auth.get('/check', _middleware_1.checkLoggedIn, auth_1.check);
exports.auth.get('/photos', auth_1.getUserPhotos);
exports.auth.post('/logout', auth_1.logout);
exports.auth.post('/check/email', auth_1.checkEmail);
exports.auth.post('/check/nickname', auth_1.checkNickName);
