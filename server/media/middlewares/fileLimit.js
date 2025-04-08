const genError = require("../utils/genError");
const sizeCheck = require("../utils/sizeCheck");

module.exports = (req, res, next) => {
  /**
   * A middleware responsible for verifying the file size of the obj uploaded
   * The file size limit is 10mb
   * This middleware checks if the obj is an Array or not before carrying out operations on it
   */

  const obj = req.files?.obj;
  if (!obj) {
    return next(genError("object must be provided"));
  }
  if (Array.isArray(obj)) {
    let state = true;
    //   for multiple files
    obj.forEach((file) => {
      const isValidSize = sizeCheck(file.size);
      if (!isValidSize) {
        state = false;
      }
    });
    if (!state) return next(genError("file size not acceptable"));
    return next();
  } else {
    // for single file
    const isValidSize = sizeCheck(obj.size);
    if (isValidSize) return next();
    else return next(genError("file size not acceptable"));
  }
};
