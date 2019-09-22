// import createError from 'http-errors';
import express from 'express';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import mongoose from 'mongoose';
import apiRoutes from './routes';
import dotenv from 'dotenv';
import seedDb from './db/index';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

dotenv.config();

const redisStore = connectRedis(session);
const client = redis.createClient(<any>process.env.REDIS_URL);

const app = express();

const DB =
  <any>process.env.NODE_ENV === 'test' ? process.env.DEV : process.env.PROD;

mongoose
  .connect(<any>DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(async () => {
    process.env.NODE_ENV !== 'test' && (await seedDb());
    console.log('connected to mongodb...');
  })
  .catch(err => {
    console.log({ error: err.message });

    process.exit(4);
  });

app.use(cors());
app.use(helmet());

app.use(
  session({
    secret: <any>process.env.JWT_PRIVATE_KEY,
    // create new redis store.
    store: new redisStore({
      host: 'localhost',
      port: 6379,
      client: client,
      ttl: 1800,
    }),
    saveUninitialized: false,
    resave: false,
  }),
);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/v1', apiRoutes);

// catch 404 and forward to error handler
// app.use(function(_req, _res, next) {
//   next(createError(404));
// });

// error handler
app.use(function(
  err: any,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

export default app;
