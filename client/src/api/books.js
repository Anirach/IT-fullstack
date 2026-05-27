import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

export const listBooks = () => api.get('/books').then((r) => r.data);
export const getBook = (id) => api.get(`/books/${id}`).then((r) => r.data);
export const createBook = (book) => api.post('/books', book).then((r) => r.data);
export const updateBook = (id, book) => api.put(`/books/${id}`, book).then((r) => r.data);
export const deleteBook = (id) => api.delete(`/books/${id}`).then((r) => r.data);
