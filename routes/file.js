require("dotenv").config();
const express = require("express");
const router = express.Router();
const models_document = require("../models/document");
const AWS = require("aws-sdk");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
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

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
});

const uploadFile = async (file) => {
  const fileStream = fs.createReadStream(file.path);
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: file.filename,
    Body: fileStream,
  };
  return await s3.upload(params).promise();
};

const deleteFile = async (fileName) => {
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: fileName,
  };
  return await s3.deleteObject(params).promise();
};

router.post(
  "/v1/documents",
  basicAuthentication,
  upload.single("file"),
  async (req, res) => {
    try {
      statsd_client.increment("myapi.post.v1.documents");
      console.log("POST /v1/documents");
      const authenticatedUser = req.authenticatedUser;
      if (!authenticatedUser) {
        return res.status(401).send({ message: "Unauthorized" });
      }

      if (req.body == null) {
        res.status(400).send({ message: "Bad request!" });
      }

      const file = req.file;
      const result = await uploadFile(file);
      const document = await models_document.create({
        user_id: authenticatedUser.id,
        name: result.Key,
        s3_bucket_path: result.Location,
      });
      res.status(201).send(document);
    } catch (err) {
      console.log(err);
    }
  }
);

router.get("/v1/documents", basicAuthentication, async (req, res) => {
  statsd_client.increment("myapi.list.v1.documents");
  console.log("POST /v1/documents");
  const authenticatedUser = req.authenticatedUser;
  if (!authenticatedUser) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  const id = authenticatedUser.id;
  const posts = await models_document.findAll({ where: { user_id: id } });
  res.status(200).send({ posts });
});

router.get("/v1/documents/:id", basicAuthentication, async (req, res) => {
  try {
    statsd_client.increment("myapi.get.v1.documents");
    console.log("GET /v1/documents/" + req.params.id);
    const authenticatedUser = req.authenticatedUser;
    if (!authenticatedUser) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const doc_id = req.params.id;
    const document = await models_document.findOne({
      where: { doc_id: doc_id },
    });
    if (!document) {
      res.status(400).send({ message: "Bad request" });
    }
    if (document.user_id != authenticatedUser.id) {
      res.status(403).send({ message: "Forbidden" });
    }
    res.status(200).send(document);
  } catch (err) {
    console.log(err);
  }
});

router.delete("/v1/documents/:id", basicAuthentication, async (req, res) => {
  try {
    statsd_client.increment("myapi.delete.v1.documents");
    const authenticatedUser = req.authenticatedUser;
    if (!authenticatedUser) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const doc_id = req.params.id;
    const document = await models_document.findOne({
      where: { doc_id: doc_id },
    });
    console.log(document);
    if (!document) {
      res.status(404).send({ message: "Not Found!" });
    }
    filename = document.name;
    await deleteFile(filename);
    await models_document.destroy({ where: { doc_id: doc_id } });
    res.status(204).send({ message: "File has successfully been deleted!" });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
