export default function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty">No books yet. Add one above.</p>;
  }

  return (
    <ul className="books">
      {books.map((book) => (
        <li key={book.id}>
          <div className="book-meta">
            <span className="book-title">{book.title}</span>
            <span className="book-author">{book.author}</span>
          </div>
          <div className="actions">
            <button className="secondary" onClick={() => onEdit(book)}>
              Edit
            </button>
            <button className="danger" onClick={() => onDelete(book.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
