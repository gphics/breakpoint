const MediaModel = require("../../model");
const genError = require("../../utils/genError");
const genRes = require("../../utils/genRes");
const s3 = require("../../config/aws");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
module.exports = async (req, res, next) => {
  try {
    const id = req.query.id;
    if (!id) return next(genError("id must be provided"));
    const media = await MediaModel.findById(id);
    if (!media) return next(genError("media object does not exist"));
    const key = media.key;
    const first = await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key,
      })
    );
    const statusCode = first.$metadata.httpStatusCode;
    if (statusCode === 204) {
      await MediaModel.findByIdAndDelete(id);
      return res.json(genRes({ msg: "media deleted successfuly" }));
    } else return next(genError("something went wrong"));
  } catch (error) {
    return next(genError(error.message));
  }
};
