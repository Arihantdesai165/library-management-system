import prisma from "../prisma";
import { Request, Response } from "express";

/**
 * BORROW A BOOK (MEMBER)
 * POST /api/borrow
 */
export const borrowBook = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book || book.available <= 0) {
      return res.status(400).json({ message: "Book not available" });
    }

    // create borrow record
    const borrow = await prisma.borrow.create({
      data: {
        userId,
        bookId,
      },
    });

    // decrease available copies
    await prisma.book.update({
      where: { id: bookId },
      data: {
        available: { decrement: 1 },
      },
    });

    res.json({
      message: "Book borrowed successfully",
      borrowId: borrow.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MY BORROWED BOOKS (MEMBER)
 * GET /api/borrow/my
 */
export const getMyBorrows = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const borrows = await prisma.borrow.findMany({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * RETURN A BOOK (MEMBER)
 * POST /api/borrow/return
 */
export const returnBook = async (req: Request, res: Response) => {
  try {
    const { borrowId } = req.body;

    if (!borrowId) {
      return res.status(400).json({ message: "Borrow ID is required" });
    }

    const borrow = await prisma.borrow.update({
      where: { id: borrowId },
      data: {
        returnedAt: new Date(),
      },
    });

    await prisma.book.update({
      where: { id: borrow.bookId },
      data: {
        available: { increment: 1 },
      },
    });

    res.json({ message: "Book returned successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
