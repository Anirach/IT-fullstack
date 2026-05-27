import { useEffect, useState } from 'react';
import BookForm from './components/BookForm.jsx';
import BookList from './components/BookList.jsx';
import { listBooks, createBook, updateBook, deleteBook } from './api/books.js';

export default function App() {
  const [books, setBooks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');

  const refresh = async () => {
    try {
      setBooks(await listBooks());
      setError('');
    } catch (e) {
      setError(e.message);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (editing) {
        await updateBook(editing.id, data);
        setEditing(null);
      } else {
        await createBook(data);
      }
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      if (editing?.id === id) setEditing(null);
      await refresh();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="app">
      <h1>Books</h1>

      <div className="card">
        <BookForm
          editing={editing}
          onSubmit={handleSubmit}
          onCancel={() => setEditing(null)}
        />
        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <BookList books={books} onEdit={setEditing} onDelete={handleDelete} />
      </div>
    </div>
  );
}
