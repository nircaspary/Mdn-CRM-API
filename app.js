const express = require('express');
const path = require('path');
const app = express();
module.exports = app;
const xss = require('xss-clean');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const AppError = require('./utils/appError');
const gloalErrorHandler = require('./controllers/errorController');

// GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
app.use(cors({ credential: true, origin: 'http://localhost:3000' }));
// Development logging
app.use(morgan('dev'));
// Limit requests from same IP
const limiter = rateLimit({
  max: 10000,
  windowMs: 60 * 60 * 1000,
  message: 'To many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);
// Body parser, reading data from body into req.body
app.use(express.json());

// Data sanitization aginst noSql query injection
app.use(mongoSanitize());
// Data sanitization aginst XSS attacks
app.use(xss());

// Serving static files if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(`${__dirname}/frontend/build`));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  });
} else app.use(express.static(path.resolve('./public')));

// Add creationTime to a request
app.use((req, res, next) => {
  req.creationTime = new Date().toISOString();
  next();
});

app.use(compression());

// ROUTES
const authRouter = require('./routes/authRoutes');
app.use('/api/v1/auth', authRouter);

const faultsRouter = require('./routes/faultsRoutes');
app.use('/api/v1/faults', faultsRouter);

const usersRouter = require('./routes/usersRoutes');
app.use('/api/v1/users', usersRouter);

const faultLogsRouter = require('./routes/faultLogsRoutes');
app.use('/api/v1/faultLogs', faultLogsRouter);

app.all('*', (req, res, next) => next(new AppError(`Cant find ${req.originalUrl} on this server`, 404)));

// Global error handler
app.use(gloalErrorHandler);
