const crypto = require('crypto');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const GitHubStrategy = require('passport-github2').Strategy;
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User } = require('../models');
const logger = require('./logger');

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

const githubStrategy = new GitHubStrategy(
  {
    clientID: config.passport.github.clientId,
    clientSecret: config.passport.github.clientSecret,
    callbackURL: config.passport.github.callbackURL,
    scope: 'user:email',
  },
  async function (accessToken, refreshToken, profile, done) {
    const userLoggedGithub = await User.findOne({
      githubId: profile.id,
    });

    if (userLoggedGithub) {
      logger.info('User already has an account login with github: %o', userLoggedGithub);
      return done(null, profile);
    }

    logger.info('User does not have an account login with github');
    const user = await User.findOne({
      email: profile.emails[0].value,
    });

    if (user) {
      logger.info('Update githubId: ', profile.id);
      user.githubId = profile.id;
      await user.save();
    } else {
      // eslint-disable-next-line no-console
      const userInfo = {
        name: profile.username,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'),
        role: 'user',
        githubId: profile.id,
        authType: 'github',
        isEmailVerified: true,
      };
      logger.info('Create user login with github user: ', userInfo);

      await User.create({
        name: profile.username,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'),
        role: 'user',
        githubId: profile.id,
        authType: 'github',
        isEmailVerified: true,
      });
    }

    return done(null, profile);
  }
);

module.exports = {
  jwtStrategy,
  githubStrategy,
};
