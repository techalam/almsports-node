
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

let refreshTokens = [];

const generateAccessToken = (user) =>
  
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES });

const generateRefreshToken = (user) => {  
  const token = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES });
  refreshTokens.push(token);
  return token;
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findUserByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(403).json({ error: "Invalid credentials" });

  const userPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(userPayload);
  const refreshToken = generateRefreshToken(userPayload);

  res.json({ accessToken, refreshToken, user });
};

exports.refresh = (req, res) => {
  const { token } = req.body;
  if (!token || !refreshTokens.includes(token)) return res.sendStatus(403);

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });
    res.json({ accessToken });
  });
};

exports.logout = (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter((t) => t !== token);
  res.sendStatus(204);
};
