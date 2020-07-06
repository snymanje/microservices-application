require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('../utils/appError');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
  // check for a token
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // eslint-disable-next-line prefer-destructuring
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.tokenSignature && req.cookies.tokenPayload) {
    token = `${req.cookies.tokenPayload}.${req.cookies.tokenSignature}`;
  }
  if (!token) {
    return next(new AppError('You are not logged in', 401));
  }
  // verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.TOKENSECRET);
  // Check if user exists
  const loggedInUser = await User.findById(decoded._id);
  if (!loggedInUser) {
    return next(
      new AppError('User for this token nolonger exists, please register', 401)
    );
  }
  // Check if the user changed his password.
  if (loggedInUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password has changed, please log in again', 401));
  }

  const arrayToken = token.split('.');
  const [tokenHeader, tokenPayload] = arrayToken;
  res.cookie('tokenPayload', `${tokenHeader}.${tokenPayload}`, {
    maxAge: process.env.COOKIEEXPIRES,
  });

  // Grant access to protected route
  req.user = loggedInUser;
  next();
};