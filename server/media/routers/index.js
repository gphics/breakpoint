const express = require("express");
const controllers = require("../controllers");

const router = express.Router();

controllers.map(({ method, action, url, mid }) => {
  if (mid) {
    router[method](url, ...mid, action);
  } else {
    router[method](url, action);
  }
});

module.exports = router;
