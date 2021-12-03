const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');

const { error } = require('./middlewares');
require('./startup/passport');

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(error);
app.use(passport.initialize());

require('./routes')(app);
require('./startup')();

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);
  console.log(`Listening on port ${process.env.PORT}`);
});
