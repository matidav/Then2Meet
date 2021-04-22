const isAuthenticated = (req, res, next) => {
    if (req.session.username) {
      next()
    } else {
      next(new Error('Could not be authenticated'))
    }
  }
  
  module.exports = isAuthenticated
  