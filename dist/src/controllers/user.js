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
exports.generateToken = exports.findByUserNickname = exports.findByUserEmail = exports.checkPassword = exports.hashPassword = void 0;
const _models_1 = require("../models");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = yield bcrypt_1.default.hash(password, 12);
    return hash;
});
exports.hashPassword = hashPassword;
const checkPassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(password, hash);
});
exports.checkPassword = checkPassword;
const findByUserEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _models_1.User.findOne({ email });
});
exports.findByUserEmail = findByUserEmail;
const findByUserNickname = (nickname) => __awaiter(void 0, void 0, void 0, function* () {
    return yield _models_1.User.findOne({ nickname });
});
exports.findByUserNickname = findByUserNickname;
const generateToken = (email, nickname) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign({
        email,
        nickname,
    }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    return token;
});
exports.generateToken = generateToken;
