// Import the required modules
const jwt = require('jsonwebtoken');

// Sample token to be verified (replace it with your actual token)
const tokenToVerify = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzA2MjQ5NDQ4LCJleHAiOjE3MDYyNTMwNDh9.fZ3RviQ_juXFyG4A-3VijEZFziJ6JP8d8qhYCMvPfzM';

// Secret key used for signing the token (replace it with your actual secret key)
const secretKey = 'JD8e&*^**';

// Function to verify the JWT token
function verifyToken(token, secret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

// Verify the token
verifyToken(tokenToVerify, secretKey)
  .then(decoded => {
    console.log('Token is valid.');
    console.log('Decoded payload:', decoded);
  })
  .catch(err => {
    console.error('Token verification failed:', err.message);
  });
