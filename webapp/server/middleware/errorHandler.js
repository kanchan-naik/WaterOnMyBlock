const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    if (res.headersSent) {
      return next(err);
    }
  
    const statusCode = err.status || 500;
    res.status(statusCode).json({
      error: {
        message: err.message || "An unexpected error occurred.",
      },
    });
  };
  
  module.exports = errorHandler;
  