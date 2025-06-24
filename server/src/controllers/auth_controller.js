const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../schemas/User_schema");
const { userSchemaZod } = require("../schemas/User_schema");
const { addUser, getUser } = require("../models/Firestore/user");
const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    userSchemaZod.parse({
      name: username,
      email: email,
      password: password,
    });

    const existedUser = await User.findOne({ email: email });
    if (existedUser != null)
      return res.status(409).send("CONFLICT: User already existed");

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = new User({
      name: username,
      email: email,
      password: encryptedPassword,
      playlists: [],
      refreshTokens: [],
    });
    // Add user to Firestore
    const firestoreUser = await addUser(username, email);
    console.log("firestoreUser", firestoreUser.id);
    if (firestoreUser.error) {
      return res.status(409).send("CONFLICT: " + firestoreUser.error);
    }
    const newUser = await user.save();
    res.status(200).send(newUser);
  } catch (error) {
    res.status(400).send("BAD REQUEST: " + error.message);
  }
};

const generateTokens = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRATION_TIME,
  });
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET
  );
  if (user.refreshTokens == null) user.refreshTokens = [refreshToken];
  else user.refreshTokens.push(refreshToken);
  await user.save();
  return { token, refreshToken };
};
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email }).populate("playlists");
    console.log("user", user);
    if (!user) return res.status(404).send("NOT FOUND: User does not exist");
    const isEmailValid = await userSchemaZod.safeParse({
      name: user.name,
      email: user.email,
      password: user.password,
    });
    if (!isEmailValid.success)
      return res.status(400).send("BAD REQUEST: Invalid user data");
    const userFirestore = await getUser(email);
    if (!userFirestore)
      return res
        .status(404)
        .send("NOT FOUND: User does not exist in Firestore");

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json("UNAUTHORIZED: Invalid password");

    const tokens = await generateTokens(user);
    res.status(200).json({
      name: user.name,
      email: user.email,
      _id: user._id,
      password: user.password,
      playlists: user.playlists,
      ...tokens,
    });
  } catch (error) {
    res.status(400).send("BAD REQUEST: " + error.message);
  }
};

// This function is used to logout the user by removing the refresh token from the database
const logout = async (req, res) => {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];
  console.log("refreshToken", refreshToken);
  if (!refreshToken) return res.sendStatus(401);
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      console.log("user", user);
      if (err) return res.sendStatus(403);
      const foundUser = await User.findById(user.id);
      if (!foundUser) return res.sendStatus(401);

      foundUser.refreshTokens = foundUser.refreshTokens.filter(
        (token) => token !== refreshToken
      );
      await foundUser.save();
      res.sendStatus(204);
    }
  );
};

// This function is used to refresh the access token using the refresh token
// The refresh token is sent in the request headers and is verified.
const refreshToken = async (req, res) => {
  const refreshToken = req.headers["authorization"]?.split(" ")[1];
  if (!refreshToken) return res.sendStatus(401);

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, user) => {
      if (err) return res.sendStatus(403);
      const foundUser = await User.findById(user.id);
      if (!foundUser) return res.sendStatus(401);
      if (!foundUser.refreshTokens.includes(refreshToken))
        return res.sendStatus(403);
      const tokens = await generateTokens(foundUser);
      res.status(200).json({
        name: foundUser.name,
        email: foundUser.email,
        _id: foundUser._id,
        password: foundUser.password,
        ...tokens,
      });
    }
  );
};

module.exports = { register, login, refreshToken, logout };
