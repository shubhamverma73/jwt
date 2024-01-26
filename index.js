// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Users = require('./users');
const app = express();
let secretKey = "JD8e&*^**"

// Middleware to parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/jwt', {
}).then(() => {
    console.log('Connected to database.');
}).catch(err => {
    console.log('Error: ' + err);
});


const PORT = 3000;
app.use(express.json());

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Function to generate a JWT token
function generateToken(user) {
  return jwt.sign(user, secretKey, { expiresIn: '5m' });
}

// Middleware to verify JWT token
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(403).json({ message: 'Token has expired' });
      } else {
        return res.status(403).json({ message: 'Invalid token' });
      }
    }

    req.user = user;
    next();
  });
}

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  //const user = Users.find(u => u.username === username);
  const user = await Users.findOne({'username': username});

  // Check if user exists and password is correct
  if (user && password == user.password) {
    const token = generateToken({ username: user.username });

    await Users.findByIdAndUpdate(user._id, { $set: { token } });

    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Registration route
app.post('/register', async (req, res) => {
  const { username, password, name, address } = req.body;

  // Check if username already exists
  const user = await Users.find({'username': username});
  if (user.length > 0) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Generate JWT token for the new user
  const token = generateToken({ username });

  // Create a new user
  const newUser = { username, password, name, address, token };
  const register = new Users(newUser);
  await register.save();

  res.json({ token });
});

// Home route (accessible without JWT token)
app.get('/home', (req, res) => {
  res.json({ message: 'Welcome to the home route!' });
});

// Profile route (requires JWT token)
app.get('/profile', verifyToken, (req, res) => {
  res.json({ message: `Welcome to the profile route, ${req.user.username}!` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
