const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const FacebookTokenStrategy = require('passport-facebook-token');
const GooglePlusTokenStrategy = require('passport-google-plus-token');
const GitHubTokenStrategy = require('passport-github-token');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const passport = require('passport');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

//passport-jwt
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    console.log(payload);
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
      console.log({ accessToken, refreshToken, profile, done });
      try {
        // Check if user has a valid email address
        if (!profile._json.email) {
          // If email is null, prompt user to provide an email address
          //throw new ApiError(httpStatus.UNAUTHORIZED, 'Please provide an email address to continue.');
          return done(null, false, { message: 'Please provide an email address to continue.' });
        }
        User.findOne({ githubId: profile.id }, async (err, user) => {
          if (err) return done(err);

          if (user) {
            return done(null, user);
          } else {
            User.findOne({ email: profile.emails[0].value }, async (err, user) => {
              if (err) return done(err);

              if (user) {
                user.githubId = profile.id;
                user.authType = profile.provider;
                // Save updated user to database
                user.save((err) => {
                  if (err) {
                    return done(err);
                  }
                  return done(null, user);
                });
                // return done(null, false, { message: 'This email is already associated with a different account.' });
              } else {
                const newUser = new User();
                newUser.githubId = profile.id;
                newUser.name = profile.displayName;
                newUser.email = profile.emails[0].value;
                newUser.save((err) => {
                  if (err) {
                    return done(err);
                  }
                  return done(null, newUser);
                });
              }
            });
          }
        });

        // const oldUser = await User.findOne({ githubId: profile.id, authType: 'github' });
        // if (oldUser) return done(null, oldUser);
        // //create a new user

        // const newUser = await new User({
        //   provider: profile.provider,
        //   githubId: profile.id,
        //   email: profile.emails[0].value,
        //   name: profile.displayName,
        //   authType: 'github',
        // });

        // console.log({ newUser: newUser });

        // await newUser.save();

        // done(null, newUser);
      } catch (error) {
        done(error, false);
      }
    }
  )
);
