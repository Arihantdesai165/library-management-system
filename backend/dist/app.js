"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const borrow_routes_1 = __importDefault(require("./routes/borrow.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use("/api/auth", auth_routes_1.default);
app.use("/api/books", book_routes_1.default);
app.use("/api/borrow", borrow_routes_1.default);
app.get("/", (_req, res) => {
    res.send("Library API is running");
});
exports.default = app;
