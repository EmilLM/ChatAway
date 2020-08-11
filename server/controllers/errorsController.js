// Section 9/ Video 5-6-9
// global error middleware
const AppError = require('../utils/appError')

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`
    return new AppError(message, 400);
}
const handleDuplicateFieldsDB = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field value: ${value[0]}. Use another name.`
    return new AppError(message, 400);
}
const handleValidationErrorDB = err => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
}
const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);
const JWTExpiredError = () => new AppError('Expired log in credentials. Please log in again!', 401);

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
        });
        // Programming or unknown error.
    } 
    // 1. log error
    console.error('ERROR:', err);
    // 2. Send generic message
    res.status(500).json({
        error: 'error',
        message: 'Something went wrong'
    })
     
}
module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    
    if (process.env.NODE_ENV === "development") {
        sendErrorDev(err, res)
    } else  if (process.env.NODE_ENV === "production") {
        let error = {...err}
        // Production error handling for invalid id req
        if (error.name === "CastError") error= handleCastErrorDB(error);
        // duplicate fields
        if (error.code === 11000) error = handleDuplicateFieldsDB(error);
        // mongoose validation errors
        if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
        // JWT verify token error: invalid token
        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        // JWT error: expired token
        if (error.name ==='TokenExpiredError') error = JWTExpiredError();
        sendErrorProd(error, res)
    }   
}