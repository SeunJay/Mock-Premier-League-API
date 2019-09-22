'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
// import createError from 'http-errors';
const express_1 = __importDefault(require('express'));
const redis_1 = __importDefault(require('redis'));
const express_session_1 = __importDefault(require('express-session'));
const connect_redis_1 = __importDefault(require('connect-redis'));
const mongoose_1 = __importDefault(require('mongoose'));
const routes_1 = __importDefault(require('./routes'));
const dotenv_1 = __importDefault(require('dotenv'));
const index_1 = __importDefault(require('./db/index'));
const cookie_parser_1 = __importDefault(require('cookie-parser'));
const morgan_1 = __importDefault(require('morgan'));
const helmet_1 = __importDefault(require('helmet'));
const cors_1 = __importDefault(require('cors'));
dotenv_1.default.config();
const redisStore = connect_redis_1.default(express_session_1.default);
const client = redis_1.default.createClient();
const app = express_1.default();
const DB = process.env.NODE_ENV === 'test' ? process.env.DEV : process.env.PROD;
mongoose_1.default
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(async () => {
    process.env.NODE_ENV !== 'test' && (await index_1.default());
    console.log('connected to mongodb...');
  })
  .catch(err => {
    console.log({ error: err.message });
    process.exit(1);
  });
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(
  express_session_1.default({
    secret: process.env.JWT_PRIVATE_KEY,
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
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use('/api/v1', routes_1.default);
// catch 404 and forward to error handler
// app.use(function(_req, _res, next) {
//   next(createError(404));
// });
// error handler
app.use(function(err, _req, res, _next) {
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
exports.default = app;
//# sourceMappingURL=app.js.map
