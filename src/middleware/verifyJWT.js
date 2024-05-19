const jwt = require("jsonwebtoken");

const verifyJwtBoth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.decode(token);
  if (!decoded || !decoded.role) {
    return res.status(403).json({ message: "Forbidden" });
  }
  const { role } = decoded;
  if (!role === "admin" || role === "collector") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const verifyWithSecret = (secret) => {
    jwt.verify(token, secret, (err, decodedVerified) => {
      if (err) {
        return res.status(401).json({ message: "Forbidden" });
      }
      console.log("accesed");
      next();
    });
  };
  if (role === "admin") {
    verifyWithSecret(process.env.ADMIN_ACCESS_TOKEN_SECRET);
  } else {
    verifyWithSecret(process.env.COLLECTOR_ACCESS_TOKEN_SECRET);
  }
};
const verifyJwtAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.decode(token);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  jwt.verify(
    token,
    process.env.ADMIN_ACCESS_TOKEN_SECRET,
    (err, decodedVerified) => {
      if (err) {
        return res.status(401).json({ message: "Forbidden" });
      }
      next();
    }
  );
};
const verifyJwtCollector = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.decode(token);
  if (!decoded || decoded.role !== "collector") {
    return res.status(403).json({ message: "Forbidden" });
  }

  jwt.verify(
    token,
    process.env.COLLECTOR_ACCESS_TOKEN_SECRET,
    (err, decodedVerified) => {
      if (err) {
        return res.status(401).json({ message: "Forbidden" });
      }
      next();
    }
  );
};

module.exports = { verifyJwtBoth, verifyJwtAdmin, verifyJwtCollector };
