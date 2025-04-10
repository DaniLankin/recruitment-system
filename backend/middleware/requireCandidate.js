function requireCandidate(req, res, next) {
    if (req.user.role !== "candidate") {
      return res.status(403).json({ error: "גישה אסורה – רק מועמדים מורשים" });
    }
    next();
  }
  
  module.exports = requireCandidate;
  