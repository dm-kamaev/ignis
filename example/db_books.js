'use strict';

module.exports = {
  _books: [],
  get_all() {
    return this._books;
  },
  create(data) {
    this._books.push(data);
  },
  update(book_id, data) {
    this._books[book_id] = data;
  },
  remove(book_id) {
    this._books = this._books.filter(el => el.id !== book_id);
  }
};
