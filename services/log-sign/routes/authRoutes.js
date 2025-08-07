const express = require('express');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const router = express.Router();
require("dotenv").config({ path: "../.env" });

// Make sure cookie-parser and cors are used in app.js
// app.use(cookieParser());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// === Google OAuth Step 1 ===
router.get('/google', passport.authenticate('google', {
  scope: [
    'profile',
    'email',
    'https://www.googleapis.com/auth/gmail.readonly'
  ],
  prompt: 'select_account'
}));

// === Google OAuth Step 2: Callback ===
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        displayName: user.displayName,
        role: user.role || 'user',
        accessToken: user.gmailAccessToken
      },
      process.env.SESSION_SECRET,
      { expiresIn: '1h' }
    );

    // Set token in secure cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    // Redirect back to frontend
    res.redirect('http://localhost:3000');
  }
);

// === Auth Check Route (Frontend calls this) ===
router.get('/check', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      status: "failed",
      error: "No token provided"
    });
  }

  try {
    const user = jwt.verify(token, process.env.SESSION_SECRET);
    console.log("in check gateway",req.cookies);
    return res.status(200).json({
      status: "success",
      user
    });
  } catch (err) {
    return res.status(401).json({
      status: "failed",
      error: "Invalid or expired token"
    });
  }
});

// === Logout (clears cookie) ===
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'Lax',
    secure: process.env.NODE_ENV === 'production'
  });
  return res.status(200).json({ message: "Logged out" });
});

// === Optional: Protected Route for Debugging ===
const jwtAuth = require("../middleware/jwt");
router.use(jwtAuth);

router.get('/me', (req, res) => {
  res.json(req.user);
});

module.exports = router;
