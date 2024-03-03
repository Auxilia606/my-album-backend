"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.api = void 0;
const koa_router_1 = __importDefault(require("koa-router"));
const auth_1 = require("./auth");
const photo_1 = require("./photo");
exports.api = new koa_router_1.default();
exports.api.use('/auth', auth_1.auth.routes());
exports.api.use('/photo', photo_1.photo.routes());
