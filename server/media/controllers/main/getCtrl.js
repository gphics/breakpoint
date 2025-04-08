const MediaModel = require("../../model");
const genError = require("../../utils/genError");
const genRes = require("../../utils/genRes");

module.exports = async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) return next(genError("object id must be provided"));
    const obj = await MediaModel.findById(id);
    if (!obj) return next(genError("invalid object id"));
    res.json(genRes({ msg: obj }));
  } catch (error) {
    return next(genError(error.message));
  }
};
