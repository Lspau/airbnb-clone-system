const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const GitHubTokenStrategy = require('passport-github-token');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const passport = require('passport');

//passport-jwt
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
  jwtStrategy,
};

//passport google token

passport.use(
  new GooglePlusTokenStrategy(
    {
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log({ accessToken, refreshToken, profile });
      try {
        const oldUser = await User.findOne({ googleId: profile.id, authType: 'google' });
        if (oldUser) return done(null, oldUser);
        //create a new user

        const newUser = await new User({
          provider: profile.provider,
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          authType: 'google',
        });

        console.log({ newUser: newUser });

        await newUser.save();

        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//passport facebook token
passport.use(
  new FacebookTokenStrategy(
    {
      clientID: config.facebook.clientID,
      clientSecret: config.facebook.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile });
      try {
        const oldUser = await User.findOne({ facebookId: profile.id, authType: 'facebook' });
        if (oldUser) return done(null, oldUser);
        //create a new user

        const newUser = await new User({
          provider: profile.provider,
          facebookId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          authType: 'facebook',
        });

        console.log({ newUser: newUser });

        await newUser.save();

        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//passport github token
passport.use(
  new GitHubTokenStrategy(
    {
      clientID: config.github.clientID,
      clientSecret: config.github.clientSecret,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log({ accessToken, refreshToken, profile });
      try {
        const oldUser = await User.findOne({ githubId: profile.id, authType: 'github' });
        if (oldUser) return done(null, oldUser);
        //create a new user

        const newUser = await new User({
          provider: profile.provider,
          githubId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          authType: 'github',
        });

        console.log({ newUser: newUser });

        await newUser.save();

        done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
