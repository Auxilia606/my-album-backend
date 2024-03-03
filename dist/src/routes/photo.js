"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.photo = void 0;
const photo_1 = require("../controllers/photo");
const _middleware_1 = require("../middleware");
const koa_router_1 = __importDefault(require("koa-router"));
exports.photo = new koa_router_1.default();
exports.photo.post('/upload', _middleware_1.checkLoggedIn, photo_1.uploadImage);
