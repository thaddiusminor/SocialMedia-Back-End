const {
  User,
  validateUser,
  validateLogin,
  Status,
  Request,
} = require("../models/user");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { makeClient } = require("../startup/db");

// All endpoints and route handlers go here

//REGISTER
router.post("/register", async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered.");
    const salt = await bcrypt.genSalt(10);
    user = new User({
      username: req.body.username,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    });
    await user.save();
    const token = user.generateAuthToken();
    return res
      .header("x-auth-token", token)
      .header("access-control-expose-headers", "x-auth-token")
      .send({ _id: user._id, username: user.username, email: user.email });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send("Invalid email or password .");
    //prolem with brcrpyt
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) return res.status(400).send("Invalid password.");
    const token = user.generateAuthToken();
    return res.send({
      token: token,
      // username:username,
      email: req.body.email,
    });
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//DELETE USER
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user)
      return res
        .status(400)
        .send(`The user with id “${id.params.id}” does not exist`);
    return res.send(user);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});
//  CREATEPOST
router.post("/status/new", async (req, res) => {
  try {
    const newStatus = new Status({
      text: req.body.text,
      email: req.body.email,
    });
    await newStatus.save();
    return res.send(newStatus);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});
//DELETE A POST
router.delete("/delete/:id", async (req, res) => {
  try {
    const newStatus = await Status.findById(req.params.id);
    if (!newStatus)
      return res
        .status(400)
        .send(`The post with id “${req.params.id}” does not exist`);
    await newStatus.deleteOne();
    return res.send("your status has been updated");
  } catch (ex) {
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});
// SEE LIST OF FRIEND REQUEST
router.get("/view/:email", async (req, res) => {
  let conn = await makeClient();
  try {
    const collection = await conn.db("myFirstDatabase").collection("status");
    const userStatuses = await collection
      .find({ email: req.params.email })
      .toArray();
    return res.send(userStatuses);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
//SEND FRIEND REQUEST
router.post("/request", async (req, res) => {
  try {
    const friendRequest = new Request({
      requesterId: req.body.requesterId,
      requesteeId: req.body.requesteeId,
    });
    await friendRequest.save();
    return res.send(friendRequest);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error:${ex}`);
  }
});
//GET POST TIMELINE
router.get("/view/:email", async (req, res) => {
  try {
    const collection = await client.db("myFirstDatabase").collection("status");
    const userStatuses = await collection
      .find({ email: req.params.email })
      .toArray();
    return res.send(userStatuses);
  } catch (ex) {
    return res.status(500).send(`Internal Server Error: ${ex}`);
  }
});
module.exports = router;
