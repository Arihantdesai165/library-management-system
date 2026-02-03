import { useEffect, useState } from "react";
import api from "../api/axios";

type Book = {
  id: number;
  title: string;
  author: string;
  available: number;
  imageUrl?: string; // ✅ added
};

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/books");
      setBooks(res.data);
    } catch {
      alert("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const borrowBook = async (bookId: number) => {
    try {
      await api.post("/borrow", { bookId });
      alert("📚 Book borrowed successfully");
      fetchBooks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      alert(err.response?.data?.message || "Borrow failed");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading books...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-100 to-purple-100">
      
      {/* Navbar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center p-4">
          <h1 className="text-2xl font-bold text-indigo-600 flex items-center gap-2">
            📚 Library Books
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/my-borrows")}
              className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition"
            >
              My Borrows
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-xl font-semibold mb-6 text-gray-700">
          Available Books
        </h2>

        {books.length === 0 ? (
          <p className="text-gray-500">No books available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
              >
                {/* 📸 Book Image */}
                <img
                  src={
                    book.imageUrl ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={book.title}
                  className="w-full h-44 object-cover"
                />

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    ✍️ {book.author}
                  </p>

                  <p className="mt-4 text-sm">
                    Available:
                    <span
                      className={`ml-2 font-semibold ${
                        book.available > 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {book.available}
                    </span>
                  </p>

                  <button
                    disabled={book.available === 0}
                    onClick={() => borrowBook(book.id)}
                    className={`mt-6 w-full py-2 rounded-xl font-medium transition
                      ${
                        book.available === 0
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                  >
                    Borrow Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
