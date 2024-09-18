const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const jwtSecret = "1234"; // Replace with your secret key

// Check if username is valid
const isValid = (username) => {
  // Example: Check if the username is a non-empty string
  return username && typeof username === 'string';
};

// Check if username and password match
const authenticatedUser = (username, password) => {
  // Iterate over the users array and check if the credentials match
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate username and password
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the user is authenticated
  if (authenticatedUser(username, password)) {
    // Generate a JWT token
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

/// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const { review } = req.body;

  // Extract username from the JWT token
  const token = req.headers['authorization'];
  let username;

  if (token) {
    jwt.verify(token.split(' ')[1], jwtSecret, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      username = decoded.username;
    });
  } else {
    return res.status(401).json({ message: "Authorization required" });
  }

  // Check if the book exists
  if (books[isbn]) {
    // Check if the user has already posted a review
    if (books[isbn].reviews[username]) {
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // Add a new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
