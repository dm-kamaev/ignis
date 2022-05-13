'use strict';

module.exports = {
  _books: [],
  get_all() {
    return this._books;
  },
  remove(book_id) {
    this._books = this._books.filter(el => el.id !== book_id);
  }
};
