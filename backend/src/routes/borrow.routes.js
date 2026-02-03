"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const borrow_controller_1 = require("../controllers/borrow.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post("/", (0, auth_1.protect)(["MEMBER"]), borrow_controller_1.borrowBook);
router.get("/my", (0, auth_1.protect)(["MEMBER"]), borrow_controller_1.getMyBorrows);
router.post("/return", (0, auth_1.protect)(["MEMBER"]), borrow_controller_1.returnBook);
exports.default = router;
