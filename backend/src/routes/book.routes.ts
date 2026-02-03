import express from "express";
import { createBook, getBooks, deleteBook } from "../controllers/book.controller";
import { protect } from "../middleware/auth";
import upload from "../middleware/upload";

const router = express.Router();

// Public
router.get("/", getBooks);

// Admin
router.post(
  "/",
  protect(["ADMIN", "LIBRARIAN"]),
  upload.single("image"),
  createBook
);

router.delete("/:id", protect(["ADMIN", "LIBRARIAN"]), deleteBook);

export default router;
