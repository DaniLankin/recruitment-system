const requireRecruiter = (req, res, next) => {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Access denied: recruiters only." });
    }
    next();
  };
  
  module.exports = requireRecruiter;
  