"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../controllers/book.controller");
const auth_1 = require("../middleware/auth");
const upload_1 = __importDefault(require("../middleware/upload"));
const router = express_1.default.Router();
// Public
router.get("/", book_controller_1.getBooks);
// Admin
router.post("/", (0, auth_1.protect)(["ADMIN", "LIBRARIAN"]), upload_1.default.single("image"), book_controller_1.createBook);
router.delete("/:id", (0, auth_1.protect)(["ADMIN", "LIBRARIAN"]), book_controller_1.deleteBook);
exports.default = router;
