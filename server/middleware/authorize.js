const AppError = require('../utils/appError');

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You are not autherized to use this page. This page is for Administrators only.', 401));
    }
    next();
  };
};
