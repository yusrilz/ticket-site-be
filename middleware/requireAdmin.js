/*
 * Middleware to make sure the logged-in user has an admin role.
 * The protect middleware must be run first so that req.user is available.
*/
const requireAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
};

module.exports = { requireAdmin };
