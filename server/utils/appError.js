// Section 9/ Video 5-6
// Error class that sets up the structure of the error
class AppError extends Error {
    constructor(message, statusCode){
        super(message);
        
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;