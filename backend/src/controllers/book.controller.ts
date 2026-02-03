import prisma from "../prisma";

/**
 * ➕ CREATE BOOK (ADMIN / LIBRARIAN)
 * POST /api/books
 */
export const createBook = async (req: any, res: any) => {
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
    const book = await prisma.book.create({
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
  } catch (error: any) {
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

/**
 * 📚 GET ALL BOOKS (PUBLIC / LOGGED-IN)
 * GET /api/books
 */
export const getBooks = async (_req: any, res: any) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { createdAt: "desc" },
    });

    res.json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch books" });
  }
};

/**
 * ❌ DELETE BOOK (ADMIN / LIBRARIAN)
 * DELETE /api/books/:id
 */
export const deleteBook = async (req: any, res: any) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    await prisma.book.delete({
      where: { id },
    });

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(404).json({ message: "Book not found" });
  }
};
