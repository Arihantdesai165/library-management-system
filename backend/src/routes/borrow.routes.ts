import express from "express";
import {
  borrowBook,
  returnBook,
  getMyBorrows,
} from "../controllers/borrow.controller";
import { protect } from "../middleware/auth";

const router = express.Router();

router.post("/", protect(["MEMBER"]), borrowBook);
router.get("/my", protect(["MEMBER"]), getMyBorrows);
router.post("/return", protect(["MEMBER"]), returnBook);

export default router;
