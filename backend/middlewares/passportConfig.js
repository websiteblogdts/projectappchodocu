const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_BASE_URL + "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find user by email
      let user = await User.findOne({ email: profile.emails[0].value });

      if (!user) {
        // If user doesn't exist, create a new one
        user = new User({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar_image: profile.photos[0].value,
          reward_points: 10000, // Set default points
          role: 'user', // Default role
          account_status: 'active', // Default account status
          password: crypto.randomBytes(16).toString('hex'), // Generate a random password
          // phone_number will be null by default
        });
        await user.save();
      } else if (!user.googleId) {
        // If the user exists but has no Google ID, update the user
        user.googleId = profile.id;
        user.avatar_image = profile.photos[0].value; // Optionally update the avatar
        await user.save();
      }

      // Check if the user has a phone number
      if (!user.phone_number) {
        // Redirect user to a page where they can add their phone number
        // Note: this redirection will be handled in the route logic
        return done(null, user, { needPhoneNumber: true });
      }

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
