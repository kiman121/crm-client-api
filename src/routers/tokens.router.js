const express = require("express");
const { decode } = require("jsonwebtoken");
const router = express.Router();

const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../models/user/User.model");

// Return refresh JWT
router.get("/", async (req, res, next) => {
  const { authorization } = req.headers;

  const decoded = await verifyRefreshJWT(authorization);

  if (decoded.email) {
    const userProf = await getUserByEmail(decoded.email);

    if (userProf._id) {
      let tokenExpDate = userProf.refreshJWT.addedAt;
      const dbRefreshToken = userProf.refreshJWT.token;

      tokenExpDate = tokenExpDate.setDate(
        tokenExpDate.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAYS
      );

      const today = new Date();

      if (dbRefreshToken !== authorization && tokenExpDate < today) {
        return res.status(403).json({ message: "Forbidden" });
      }

      const accessJWT = await createAccessJWT(
        decode.email,
        userProf._id.toString()
      );

      return res.json({ status: "success", accessJWT });
    }
  }

  res.status(403).json({ message: "Forbidden" });
});

module.exports = router;
