const express = require("express");
const router = express.Router();
const validator = require("email-validator");
const models_user = require("../models/user");
const bcrypt = require("bcrypt");
const StatsD = require("node-statsd"),
  statsd_client = new StatsD();

const basicAuthentication = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const encoded = authorization.substring(6);
    const decoded = Buffer.from(encoded, "base64").toString("ascii");
    const [username, password] = decoded.split(":");
    const authenticatedUser = await models_user.findOne({
      where: { username: username },
    });
    if (authenticatedUser) {
      const match = await bcrypt.compare(password, authenticatedUser.password);
      if (match) {
        req.authenticatedUser = authenticatedUser;
      }
    }
  }
  next();
};

router.get("/healthz", (req, res) => {
  statsd_client.increment("myapi.get.healthz");
  console.log("GET /healthz");
  res.status(200).send();
});

router.post("/v1/account", async (req, res, next) => {
  statsd_client.increment("myapi.post.v1.account");
  console.log("POST /v1/account");
  try {
    const data = await models_user.findOne({
      where: { username: req.body.username },
    });
    if (data) {
      return res.status(400).send({
        message: "Please Use a different username!",
      });
    }
    if (!validator.validate(req.body.username)) {
      return res.status(400).send({
        message: "Please use a email!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const user = await models_user.create({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: await bcrypt.hash(req.body.password, salt),
      username: req.body.username,
    });
    delete user.dataValues.password;
    res.status(201).send(user);
  } catch (err) {
    console.log(err);
  }
});

router.get("/v1/account/:id", basicAuthentication, async (req, res) => {
  statsd_client.increment("myapi.get.v1.account");
  console.log("GET /v1/account/" + req.params.id);
  const authenticatedUser = req.authenticatedUser;
  if (!authenticatedUser) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const id = req.params.id;

  const user = await models_user.findOne({ where: { id: id } });
  if (!user) {
    res.status(403).send({ message: "Forbidden" });
  }
  res.status(200).send({
    id: user.dataValues.id,
    first_name: user.dataValues.firstname,
    last_name: user.dataValues.lastname,
    username: user.dataValues.username,
    account_created: user.dataValues.createdAt,
    account_updated: user.dataValues.updatedAt,
    isVerified: user.dataValues.isVerified,
  });
});

router.put("/v1/account/:id", basicAuthentication, async (req, res) => {
  statsd_client.increment("myapi.put.v1.account");
  console.log("PUT /v1/account/" + req.params.id);
  const authenticatedUser = req.authenticatedUser;
  if (!authenticatedUser) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  if (!Object.keys(req.body).length) {
    res.status(204).send({ message: "No Content" });
  }

  const id = req.params.id;

  if (authenticatedUser.id != id) {
    res.status(403).send({ message: "Forbidden" });
  }

  const user = await models_user.findOne({ where: { id: id } });
  if (
    user.username != req.body.username ||
    req.body.id != null ||
    req.body.created != null ||
    req.body.updated != null
  ) {
    res.status(400).send({ message: "Bad request" });
  }
  user.firstname = req.body.firstname;
  user.lastname = req.body.lastname;
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(req.body.password, salt);
  await user.save();
  res.status(204).send();
});

module.exports = router;
