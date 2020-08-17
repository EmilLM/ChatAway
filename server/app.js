const express = require('express');
const cors = require('cors');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');

const globalErrorHandler = require('./controllers/errorsController');
const usersRouter = require('./routes/usersRoute');
const roomsRouter = require('./routes/roomsRoute');
const loggedInRouter = require('./routes/loggedinRoute');
const messagesRouter = require('./routes/messagesRoute');
const chatRouter = require('./routes/chatRoute');

const app = express();

// 1.Global Middleware
app.use(cors()); 

// Set security HTTP headers
app.use(helmet());


// Limit requests from same API
const loginLimiter = rateLimit({
    max: 6,
    windowMs: 60 * 60 * 1000,
    message: 'Too many log in attempts. Try again in an hour!'
});
const limiter = rateLimit({
    max: 1000,
    windowMs: 60 * 60 *1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/users/login', loginLimiter);
app.use('/', limiter);


// Body parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['name']
}));

// Misc
// compressing text sent to clients
app.use(compression())

// test MW
app.use((req, res, next)=>{
    req.requestTime = new Date().toISOString;
    // console.log(req.cookies);
    next()
})

// 2. Routes

app.use('/api/users', usersRouter);
app.use('/api/rooms', roomsRouter);
app.use('/loggedIn', loggedInRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/chat', chatRouter);


app.use(globalErrorHandler);

module.exports = app;