// section 9 / video 7
// error helper fn to avoid writing try/catch in async controllers
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err)) 
    }
}
