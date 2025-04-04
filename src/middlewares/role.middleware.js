const roleMiddleware = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No user data found" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: You do not have permission" });
  }

  next();
};

module.exports = roleMiddleware;
