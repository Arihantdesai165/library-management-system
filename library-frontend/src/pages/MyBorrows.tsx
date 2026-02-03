import { useEffect, useState } from "react";
import api from "../api/axios";

type Borrow = {
  id: number;
  book: {
    title: string;
    author: string;
  };
};

export default function MyBorrows() {
  const [borrows, setBorrows] = useState<Borrow[]>([]);

  const fetchBorrows = async () => {
    const res = await api.get("/borrow/my");
    setBorrows(res.data);
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const returnBook = async (borrowId: number) => {
    await api.post("/borrow/return", { borrowId });
    fetchBorrows();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">📦 My Borrowed Books</h1>

        {borrows.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow">
            <p className="text-gray-500">You haven’t borrowed any books yet</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {borrows.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-xl shadow p-6 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{b.book.title}</p>
                  <p className="text-sm text-gray-500">
                    {b.book.author}
                  </p>
                </div>
                <button
                  onClick={() => returnBook(b.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Return
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
