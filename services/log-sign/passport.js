const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UAParser = require('ua-parser-js');
const fetch = require('node-fetch');
const User = require('./Model/userModel');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/gmail.readonly' // ✅ Gmail access
      ],
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const ip = req.ip;
        const userAgent = req.headers['user-agent'];
        const parser = new UAParser(userAgent);
        const ua = parser.getResult();
        console.log('🧠 Google Profile:', profile);

        // (Optional) IP Geolocation
        let location = { city: '', region: '', country: '' };
        try {
          const res = await fetch(`https://ipinfo.io/${ip}/json?token=your_token_here`);
          const data = await res.json();
          location = {
            city: data.city || '',
            region: data.region || '',
            country: data.country || '',
          };
        } catch (err) {
          console.warn('Could not fetch IP location (probably internal IP)');
        }

        const updateData = {
          displayName: profile.displayName,
          email: profile.emails[0].value,
          loginAt: Date.now(),
          ipAddress: ip,
          userAgent,
          os: ua.os.name,
          browser: ua.browser.name,
          device: ua.device.type || 'desktop',
          location,
          gmailAccessToken: accessToken, // ✅ Store Gmail access token
        };

        const existingUser = await User.findOneAndUpdate(
          { googleId: profile.id },
          updateData,
          { new: true, upsert: true }
        );

        done(null, existingUser);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
