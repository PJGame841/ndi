const passport = require('passport');
const { Client } = require('../models');
const { checkLogin } = require('../schemas/client');
const CustomBearerStrategy = require('passport-http-custom-bearer').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GithubStrategy = require('passport-github').Strategy;

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('serial', user);
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log('dese', id);
    Client.findById(id, (err, user) => {
      console.log('dese', user, err);
      done(err, user);
    });
  });

  passport.use(
    'api-bearer',
    new CustomBearerStrategy({ headerName: 'Authorization' }, function (
      token,
      done
    ) {
      console.log(token, done);
      Client.findOne({ token }, function (err, user) {
        if (err) return done(err);
        if (!client) return done(null, false);
        return done(null, client);
      });
    })
  );

  passport.use(
    'zyzz-connection',
    new CustomStrategy((req, done) => {
      checkLogin(
        req,
        {
          status: () => {
            send: (msg) => {
              done(JSON.parse(msg).data.message);
            };
          },
        },
        () => {
          Client.findOne(
            { username: req.body.username },
            async (err, client) => {
              if (err) return done(err);
              if (!client)
                return done(null, false, { message: 'No client found !' });
              if (client.password == 'null')
                return done(null, false, {
                  message: 'Please login via Google/Facebook or Github !',
                });
              if (!(await client.checkPassword(req.body.password))) {
                return done(null, false, { message: 'Mauvais mot de passe !' });
              }
              return done(null, client);
            }
          );
        }
      );
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.API_URL + '/auth/google/callback',
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //   return done(err, user);
        // });
        const client = await Client.findOne({
          $or: [
            { googleId: profile.id },
            {
              $and: [
                { username: profile.displayName },
                { email: profile.email },
              ],
            },
          ],
        });
        if (!client) {
          const newClient = await Client.create({
            username: profile.displayName,
            password: 'null',
            nom: profile.name.familyName || 'N/A',
            prenom: profile.name.givenName || 'N/A',
            email: profile.email,
            googleId: profile.id,
          });
          return done(null, newClient);
        }

        return done(null, client);
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: process.env.API_URL + '/auth/facebook/callback',
        profileFields: ['id', 'emails', 'name'],
      },
      async function (accessToken, refreshToken, profile, done) {
        const client = await Client.findOne({
          $or: [
            { facebookId: profile.id },
            {
              $and: [
                { username: profile.displayName },
                { email: profile.email },
              ],
            },
          ],
        });
        if (!client) {
          const newClient = await Client.create({
            username:
              profile.displayName ||
              profile.username ||
              profile.familyName + profile.givenName,
            password: 'null',
            nom: profile.name.familyName || 'N/A',
            prenom: profile.name.givenName || 'N/A',
            email: profile.email || profile._json.email,
            facebookId: profile.id,
          });
          return done(null, newClient);
        }

        return done(null, client);
      }
    )
  );

  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.API_URL + '/auth/github/callback',
        scope: 'user:email',
      },
      async function (accessToken, refreshToken, profile, done) {
        console.log(profile);

        const client = await Client.findOne({
          $or: [
            { githubId: profile.id },
            {
              $and: [{ username: profile.username }, { email: profile.email }],
            },
          ],
        });
        if (!client) {
          const newClient = await Client.create({
            username: profile.username,
            password: 'null',
            nom: profile.name || 'N/A',
            prenom: profile.name || 'N/A',
            email: profile.email || 'undefined@gmail.com',
            githubId: profile.id,
          });
          return done(null, newClient);
        }

        return done(null, client);
      }
    )
  );
};
