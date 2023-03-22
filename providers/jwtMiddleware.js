
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send('No token provided');
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).send('Failed to authenticate token');
    }
    if (req.baseUrl == "/api/admin") {
      const admin = await User.findOne({ email: decoded.email, role: 'admin' })
      if (!admin) {
        return res.status(401).send({message:'Unauthorised! Not an admin user.'});
      }
      req.user = admin;
    }
    next();
  });
}

module.exports = verifyToken;
