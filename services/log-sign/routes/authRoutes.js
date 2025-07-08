const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require("jsonwebtoken");
const jwtAuth = require("../middleware/jwt");

require("dotenv").config({path: "../.env"});



router.get('/google', passport.authenticate('google', {
  scope: [
  'profile',
  'email',
  'https://www.googleapis.com/auth/gmail.readonly'
],
  prompt: 'select_account'
}));


router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const user = req.user;
    
    const token = jwt.sign({
      userId : req.user._id.toString(),
      email: req.user.email,
      displayName: req.user.displayName,
      role: req.user.role || 'user',
      accessToken: user.gmailAccessToken
    },
  
    process.env.SESSION_SECRET,
    {expiresIn: '1h'}
  );
    // res.send('Logged in with Google!');
    res.status(200).json({
      status: "success",
      token: token,

    })
  }
);

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie('connect.sid');

      // 🔥 Redirect to Google logout (optional)
      res.redirect('http://localhost:5000/');

    });
  });
});

router.use(jwtAuth);

router.get('/me', (req, res) => {
  res.send(req.user);
});

module.exports = router;
