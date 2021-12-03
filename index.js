require('dotenv').config();

const needEnv = {
  PORT: 3000,
  DB_URI: null,
  JWT_KEY: null,
  GOOGLE_CLIENT_ID: null,
  GOOGLE_CLIENT_SECRET: null,
  FACEBOOK_APP_ID: null,
  FACEBOOK_APP_SECRET: null,
  GITHUB_CLIENT_ID: null,
  GITHUB_CLIENT_SECRET: null,
  LOGIN_SALT: null,
  SESSION_SECRET: null,
  API_URL: null,
  FRONT_URL: null,
};

Object.keys(needEnv).forEach((env_name) => {
  if (!process.env[env_name]) {
    if (needEnv[env_name] === null) {
      throw new Error('You need to provide the env variable ' + env_name);
    }

    process.env[env_name] = needEnv[env_name];
    console.log(
      'Env variable ' +
        env_name +
        ' has been automaticly set to ' +
        needEnv[env_name]
    );
  }
});

require('./src');
