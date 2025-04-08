const fileLimit = require("../middlewares/fileLimit");
const deleteCtrl = require("./main/deleteCtrl");
const getCtrl = require("./main/getCtrl");
const updateCtrl = require("./main/updateCtrl");
const uploadCtrl = require("./main/uploadCtrl");

module.exports = [
  { method: "get", action: getCtrl, url: "" },
  { method: "post", action: uploadCtrl, url: "/upload", mid: [fileLimit] },
  { method: "put", action: updateCtrl, url: "/update", mid: [fileLimit] },
  { method: "delete", action: deleteCtrl, url: "/delete" },
];
