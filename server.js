const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception, Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// MongoDB DB connection
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`DB "${process.env.DATABASE_NAME}" Connected successfully`));

// Run Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`CRM Application listening on port ${port} on ${process.env.NODE_ENV} mode... `);
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection, Shutting Down...');
  console.log(err.name, err.message);
  // First server finish to handle all requests pending by server.close(), and then shut the server down with proccess.exit(1)
  server.close(() => process.exit(1));
});
