"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("@koa/cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const koa_1 = __importDefault(require("koa"));
const koa_body_1 = __importDefault(require("koa-body"));
const koa_bodyparser_1 = __importDefault(require("koa-bodyparser"));
const koa_router_1 = __importDefault(require("koa-router"));
const mongoose_1 = __importDefault(require("mongoose"));
const jwt_1 = require("./middleware/jwt");
const routes_1 = require("./routes");
dotenv_1.default.config();
const { PORT, MONGO_URI } = process.env;
const app = new koa_1.default();
const router = new koa_router_1.default();
app.use((0, koa_body_1.default)({ multipart: true }));
app.use((0, cors_1.default)({ credentials: true }));
router.use(routes_1.api.routes());
// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
app.use((0, koa_bodyparser_1.default)());
app.use(jwt_1.jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
});
mongoose_1.default
    .connect(MONGO_URI)
    .then(() => {
    console.log('connected to mongoose');
})
    .catch((error) => {
    console.error(error);
});
