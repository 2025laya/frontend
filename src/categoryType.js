import React, { useEffect, useState } from "react";
import { categoriesByMood } from "./category";

export default function CategoryType({ setpage, selectedCategory }) {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  // const [loading, setLoading] = useState(true);

  // 1. جلب الكتب من API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
      //  finally {
      //   setLoading(false);
      // }
    };

    fetchBooks();
  }, []);

  // 2. فلترة الكتب حسب الكاتيجوري
  useEffect(() => {
    if (!selectedCategory || !Array.isArray(books)) return;

    const keywords = categoriesByMood[selectedCategory] || [];

    const result = books.filter((book) => {
      const text = [
        book?.category,
        book?.title,
        book?.summary
      ]
        .join(" ")
        .toLowerCase();

      return keywords.some((word) =>
        text.includes(word.toLowerCase())
      );
    });

    setFilteredBooks(result);
  }, [selectedCategory, books]);

  // if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{selectedCategory}</h2>

      {filteredBooks.map((book) => (
        <div key={book._id}>
          <h3>{book.title}</h3>
          <p>{book.summary}</p>
        </div>
      ))}

      <button onClick={() => setpage("home")}>
        رجوع
      </button>
    </div>
  );
}