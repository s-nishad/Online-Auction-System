const { sign, verify } = require('jsonwebtoken');

const createToken = (admin) => {
  const accessToken = sign(
    { email: admin.email, id: admin._id },
    "jwtsecretplzdontsteal",
    { expiresIn: '1h' }
  );
  return accessToken;
};

const validateToken = (req, res, next) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(400).json({ message: "No token provided" });
  }

  try {
    const validToken = verify(accessToken, 'jwtsecretplzdontsteal');
    if (validToken) {
      req.auhenticated = true
      return next();
    }
  } catch (err) {
    return res.status(400).json({ error: err });
  }
};

module.exports = { createToken, validateToken };
