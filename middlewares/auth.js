const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const isAuthenticated = function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, "SECRET MESSAGE", (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};
const isAdmin = (req, res, next) => {
  if (req.user.dataValues.isAdmin) {
    next();
  } else {
    res.status(401).json({
      err: "You are not a Admin",
    });
  }
};

const isUser = (req, res, next) => {
  if (!req.user.dataValues.isAdmin) {
    next();
  } else {
    res.status(401).json({ err: "You are not a User" });
  }
};

module.exports = { isAuthenticated, isAdmin, isUser };

// const checkRole = (role) => (req, res, next) => {
//   const authHeader = req.headers["authorization"];
//   console.log(authHeader);
//   const token = authHeader && authHeader.split(" ")[1];
//   console.log(token);
//   if (!token) {
//     return res.status(401).json({ error: "Unauth" });
//   }
//   jwt.verify(token, "SECRET MESSAGE", (err, user) => {
//     if (err) {
//       return res.status(401).json({ error: "Unauthori" });
//     }
//     req.user = user;
//     if (req.user.role === role) {
//       next();
//     } else {
//       res.status(401).json({ error: "Unauthorized" });
//     }
//   });
// };

// function authenticateToken(req, res, next) {
//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (token == null) return res.sendStatus(401)

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     console.log(err)
//     if (err) return res.sendStatus(403)
//     req.user = user
//     next()
//   })
// }
