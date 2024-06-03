const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const csrf = require('csurf');
const mongoose = require('mongoose');
// const http = require('http');
// const { Server } = require('socket.io');

const app = express();
// const server = http.createServer(app);
// const io = new Server(server);
const config = require('./config');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb.connection)
  .then(() => console.log('connection successful'))
  .catch((err) => console.error(err));

const indexRouter = require('./routes/index');
const userRouter = require('./routes/users');
const fileRouter = require('./routes/files');
const experimentRouter = require('./routes/experiment');
const adminRouter = require('./routes/admin');
const callRouter = require('./routes/call').router;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// app.use(csrf({ cookie: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Assign to the Request
app.use((req, _res, next) => {
  req.mongoose = null; // TODO.
  next();
});

app.use('/api', indexRouter);
app.use('/api/users', userRouter);
app.use('/api/files', fileRouter);
app.use('/api/experiment', experimentRouter);
app.use('/api/admin', adminRouter);
app.use('/api/call', callRouter);

// Required for production builds
if (config.environment === 'PROD') {
  app.use('/*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}
// catch 404 and forward to error handler
app.use((_req, _res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json({ error: err });
});

module.exports = app;
