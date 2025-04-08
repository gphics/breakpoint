const MediaModel = require("../../model");
const genError = require("../../utils/genError");
const genRes = require("../../utils/genRes");
const mediaMetadataConstructor = require("../../utils/mediaMetadataConstructor");
const s3 = require("../../config/aws");
const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");

module.exports = async (req, res, next) => {
  try {
    const id = req.query.id;

    if (!id) return next(genError("object id must be provided"));
    const media = await MediaModel.findById(id);
    if (!media) return next(genError("object does not exist"));
    const obj = req.files.obj;
    if (Array.isArray(obj))
      return next(genError("Multiple update not allowed"));

    // main work

    // deleting the object from s3
    const first = await s3.send(
      new DeleteObjectCommand({
        Key: media.key,
        Bucket: process.env.AWS_BUCKET_NAME,
      })
    );
    // uploading to s3
    if (first.$metadata.httpStatusCode === 204) {
      const { bucket_name, key, url, body, mimetype } =
        mediaMetadataConstructor(obj);
      await s3.send(
        new PutObjectCommand({
          Bucket: bucket_name,
          Body: body,
          Key: key,
          ContentType: mimetype,
        })
      );
      media.mimetype = mimetype;
      media.key = key;
      media.url = url;
      await media.save();
      return res.json(genRes({ msg: "update successful" }));
    } else return next(genError("something went wrong"));
  } catch (error) {
    return next(genError(error.message));
  }
};
