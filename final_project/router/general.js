const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if user already exists
  if (users[username]) {
      return res.status(400).json({ message: "User already exists" });
  }

  // Register new user
  users[username] = { password };
  return res.status(200).json({ message: "User successfully registered" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4)); // Pretty print the books object
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
      return res.status(200).json(books[isbn]);
  } else {
      return res.status(404).json({ message: "Book not found" });
  }
});
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
      return res.status(200).json(booksByAuthor);
  } else {
      return res.status(404).json({ message: "Books by this author not found" });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title));

  if (booksByTitle.length > 0) {
      return res.status(200).json(booksByTitle);
  } else {
      return res.status(404).json({ message: "Books with this title not found" });
  }
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn] && books[isbn].reviews) {
      return res.status(200).json(books[isbn].reviews);
  } else {
      return res.status(404).json({ message: "Book or reviews not found" });
  }
});

module.exports.general = public_users;
