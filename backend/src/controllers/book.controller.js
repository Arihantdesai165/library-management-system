"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBook = exports.getBooks = exports.createBook = void 0;
const prisma_1 = __importDefault(require("../prisma"));
/**
 * ➕ CREATE BOOK (ADMIN / LIBRARIAN)
 * POST /api/books
 */
const createBook = async (req, res) => {
    try {
        // 🔹 multipart/form-data fields
        const title = req.body?.title;
        const author = req.body?.author;
        const isbn = req.body?.isbn;
        const totalCopies = req.body?.totalCopies;
        // 📸 image from multer (Cloudinary/local)
        const imageUrl = req.file?.path || null;
        // ✅ Validation
        if (!title || !author || !isbn || totalCopies === undefined) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (Number(totalCopies) <= 0) {
            return res.status(400).json({
                message: "Total copies must be greater than 0",
            });
        }
        // ✅ Create book
        const book = await prisma_1.default.book.create({
            data: {
                title,
                author,
                isbn,
                totalCopies: Number(totalCopies),
                available: Number(totalCopies), // ✅ FIXED
                imageUrl, // 📸 stored image URL
            },
        });
        return res.status(201).json({
            message: "Book added successfully",
            book,
        });
    }
    catch (error) {
        // ❌ Duplicate ISBN
        if (error.code === "P2002") {
            return res.status(409).json({
                message: "Book with this ISBN already exists",
            });
        }
        console.error(error);
        return res.status(500).json({ message: "Failed to create book" });
    }
};
exports.createBook = createBook;
/**
 * 📚 GET ALL BOOKS (PUBLIC / LOGGED-IN)
 * GET /api/books
 */
const getBooks = async (_req, res) => {
    try {
        const books = await prisma_1.default.book.findMany({
            orderBy: { createdAt: "desc" },
        });
        res.json(books);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch books" });
    }
};
exports.getBooks = getBooks;
/**
 * ❌ DELETE BOOK (ADMIN / LIBRARIAN)
 * DELETE /api/books/:id
 */
const deleteBook = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (!id) {
            return res.status(400).json({ message: "Invalid book ID" });
        }
        await prisma_1.default.book.delete({
            where: { id },
        });
        res.json({ message: "Book deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(404).json({ message: "Book not found" });
    }
};
exports.deleteBook = deleteBook;
