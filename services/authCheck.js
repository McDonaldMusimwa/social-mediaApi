const authCheck = (req, res, next) => {
    console.log(req.user)
  if (!req.user) {
    // if user is not logged in
    return false;
  } else {
    return true;
  }
};

module.exports = authCheck;
