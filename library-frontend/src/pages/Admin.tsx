import { useEffect, useState } from "react";
import api from "../api/axios";

type Book = {
  id: number;
  title: string;
  author: string;
  available: number;
  imageUrl?: string;
};

export default function Admin() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  // form fields
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [copies, setCopies] = useState(""); // ✅ string for backspace
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchBooks = async () => {
    const res = await api.get("/books");
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const addBook = async () => {
    if (!title || !author || !isbn || !copies) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // ✅ Use FormData (for image upload)
      const formData = new FormData();
      formData.append("title", title);
      formData.append("author", author);
      formData.append("isbn", isbn);
      formData.append("totalCopies", copies);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post("/books", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset form
      setTitle("");
      setAuthor("");
      setIsbn("");
      setCopies("");
      setImageFile(null);

      fetchBooks();
    } catch {
      alert("Failed to add book");
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: number) => {
    if (!confirm("Delete this book?")) return;
    await api.delete(`/books/${id}`);
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-700">
            📊 Admin Dashboard
          </h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">Total Books</p>
            <h2 className="text-2xl font-bold">{books.length}</h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">Available Copies</p>
            <h2 className="text-2xl font-bold text-green-600">
              {books.reduce((a, b) => a + b.available, 0)}
            </h2>
          </div>
          <div className="bg-white rounded-xl p-6 shadow">
            <p className="text-gray-500">Status</p>
            <h2 className="text-2xl font-bold text-indigo-600">Active</h2>
          </div>
        </div>

        {/* Add Book */}
        <div className="bg-white rounded-xl shadow p-6 mb-10">
          <h2 className="text-lg font-semibold mb-4">➕ Add New Book</h2>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              placeholder="Title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Author"
              className="input"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <input
              placeholder="ISBN"
              className="input"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
            />
            <input
              type="number"
              min={1}
              placeholder="Total Copies"
              value={copies}
              onChange={(e) => setCopies(e.target.value)}
              className="input"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="input"
            />
          </div>

         <button
  onClick={addBook}
  disabled={loading}
  className={`mt-4 px-6 py-2 rounded-lg text-white 
    ${loading ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"}`}
>
  {loading ? "Adding..." : "Add Book"}
</button>

        </div>

        {/* Books List */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">📚 Books List</h2>

          <div className="space-y-4">
            {books.map((b) => (
              <div
                key={b.id}
                className="flex justify-between items-center border p-4 rounded-lg"
              >
                <div className="flex gap-4 items-center">
                  {b.imageUrl && (
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      className="w-16 h-20 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{b.title}</p>
                    <p className="text-sm text-gray-500">{b.author}</p>
                    <p className="text-sm">Available: {b.available}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteBook(b.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
