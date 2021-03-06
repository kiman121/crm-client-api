const express = require("express");

const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../models/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");

router.all("/", (req, res, next) => {
  //   res.json({
  //     message: "return from user router",
  //   });
  next();
});

// Get user profile router
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;
  const userProf = await getUserById(_id);

  res.json({ user: userProf });
});

// Create new user route
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;

  try {
    // Has password
    const hashedPass = await hashPassword(password);
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({ message: "New user created", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// User login route
router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  // Hash password and compare with db password
  if (!email || !password) {
    return res.json({ status: "error", message: "Invalid form submission!" });
  }

  // Get user with email from db
  const user = await getUserByEmail(email);

  const passFromDb = user && user._id ? user.password : null;

  if (!passFromDb)
    return res.json({ status: "error", message: "Invalid email or password!" });

  const result = await comparePassword(password, passFromDb);

  if (!result)
    return res.json({ status: "error", message: "Invalid email or password!" });

  const accessJWT = await createAccessJWT(user.email, `${user._id}`);
  const refreshJWT = await createRefreshJWT(user.email, user._id);

  res.json({
    status: "success",
    message: "login Successfull",
    accessJWT,
    refreshJWT,
  });
});

module.exports = router;
