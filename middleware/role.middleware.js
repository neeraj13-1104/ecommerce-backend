export const allowRoles = (...roles) => {
  return (req, res, next) => {
    console.log("this is data");
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }
    next();
  };
};
