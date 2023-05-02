const User = require('../models/user.model');

async function authenticateUserWithSocialProvider(provider, profile, role, done) {
  try {
    // Check if user has a valid email address
    if (!profile.emails || !profile.emails[0].value) {
      return done(null, false, { message: 'Please provide an email address to continue.' });
    }

    // Find user by social ID
    const user = await User.findOne({ [`${provider}Id`]: profile.id });

    if (user) {
      // If user already exists, check user role
      if (user.role !== role) {
        // If user is a host, return user with host role
        user.role = role;
        await user.save();
        return done(null, user);
      } else {
        // If user is not a host, return user with user role
        return done(null, user);
      }
    } else {
      // If user does not exist, find user by email
      const userWithEmail = await User.findOne({ email: profile.emails[0].value });

      if (userWithEmail) {
        // If user with email exists, update user with social ID: one email in many login methods
        userWithEmail[`${provider}Id`] = profile.id;
        userWithEmail[`${provider}Name`] = profile.displayName;
        userWithEmail.logInWith = provider;

        // Save updated user to database
        await userWithEmail.save();

        // Check user role
        if (userWithEmail.role === 'host') {
          // If user is a host, return user with host role
          return done(null, { ...userWithEmail.toObject(), role: 'host' });
        } else {
          // If user is not a host, return user with user role
          return done(null, userWithEmail);
        }
      } else {
        // If user with email does not exist, create new user
        const newUser = new User();
        newUser[`${provider}Id`] = profile.id;
        newUser[`${provider}Name`] = profile.displayName;
        newUser.email = profile.emails[0].value;
        newUser.logInWith = provider;
        newUser.role = role;

        await newUser.save();

        return done(null, newUser);
      }
    }
  } catch (error) {
    return done(error, false);
  }
}

module.exports = authenticateUserWithSocialProvider;
