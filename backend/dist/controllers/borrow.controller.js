"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.returnBook = exports.getMyBorrows = exports.borrowBook = void 0;
const prisma_1 = __importDefault(require("../prisma"));
/**
 * BORROW A BOOK (MEMBER)
 * POST /api/borrow
 */
const borrowBook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookId } = req.body;
        if (!bookId) {
            return res.status(400).json({ message: "Book ID is required" });
        }
        const book = await prisma_1.default.book.findUnique({
            where: { id: bookId },
        });
        if (!book || book.available <= 0) {
            return res.status(400).json({ message: "Book not available" });
        }
        // create borrow record
        const borrow = await prisma_1.default.borrow.create({
            data: {
                userId,
                bookId,
            },
        });
        // decrease available copies
        await prisma_1.default.book.update({
            where: { id: bookId },
            data: {
                available: { decrement: 1 },
            },
        });
        res.json({
            message: "Book borrowed successfully",
            borrowId: borrow.id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.borrowBook = borrowBook;
/**
 * GET MY BORROWED BOOKS (MEMBER)
 * GET /api/borrow/my
 */
const getMyBorrows = async (req, res) => {
    try {
        const userId = req.user.id;
        const borrows = await prisma_1.default.borrow.findMany({
            where: {
                userId,
                returnedAt: null, // only active borrows
            },
            include: {
                book: true, // include book details
            },
            orderBy: {
                borrowedAt: "desc",
            },
        });
        res.json(borrows);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getMyBorrows = getMyBorrows;
/**
 * RETURN A BOOK (MEMBER)
 * POST /api/borrow/return
 */
const returnBook = async (req, res) => {
    try {
        const { borrowId } = req.body;
        if (!borrowId) {
            return res.status(400).json({ message: "Borrow ID is required" });
        }
        const borrow = await prisma_1.default.borrow.update({
            where: { id: borrowId },
            data: {
                returnedAt: new Date(),
            },
        });
        await prisma_1.default.book.update({
            where: { id: borrow.bookId },
            data: {
                available: { increment: 1 },
            },
        });
        res.json({ message: "Book returned successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.returnBook = returnBook;
