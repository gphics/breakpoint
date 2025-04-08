const MediaModel = require("../../model");
const genError = require("../../utils/genError");
const genRes = require("../../utils/genRes");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../../config/aws");
const mediaMetadataConstructor = require("../../utils/mediaMetadataConstructor");

// module.exports = async (req, res, next) => {
//   try {
//     const obj = req.files.obj;
//     const isArray = Array.isArray(obj);
//     // multiple file upload
//     if (isArray) {
//       const first = obj.map((elem) => mediaMetadataConstructor(elem));
//       const firstResult = [];
//       first.forEach(async (elem) => {
//         const { mimetype, key, url, body, bucket_name } = elem;
//         // uploading to s3 bucket
//         const action = await s3.send(
//           new PutObjectCommand({
//             ContentType: mimetype,
//             Key: key,
//             Bucket: bucket_name,
//             Body: body,
//           })
//         );
//         // confirming if the object is uploaded successfully
//         const { httpStatusCode } = action.$metadata;
//         if (httpStatusCode == 200) {
//           console.log(action)
//           firstResult.push({ mimetype, url, key });
//         } else {
//           return next(genError("something went wrong"));
//         }
//       });
//       console.log(firstResult)
//     } else {
//       const { mimetype, key, url, body, bucket_name } =
//         mediaMetadataConstructor(obj);
//       const first = await s3.send(
//         new PutObjectCommand({
//           ContentType: mimetype,
//           Key: key,
//           Bucket: bucket_name,
//           Body: body,
//         })
//       );
//       const { httpStatusCode } = first.$metadata;
//       if (httpStatusCode == 200) {
//         const media = await MediaModel.create({ mimetype, key, url });
//         res.json(genRes({ msg: media }));
//       } else {
//         return next(genError("something went wrong"));
//       }
//     }
//     return res.json(genRes({ msg: "file uploaded" }));
//   } catch (error) {
//     console.log(error);
//     // return next(genError(error.message));
//   }
// };

module.exports = async (req, res, next) => {
  try {
    const obj = req.files.obj;
    const isArray = Array.isArray(obj);
    // multiple file upload
    if (isArray) {
      // getting file metadata
      const params = obj.map((elem) => mediaMetadataConstructor(elem));
      // main work
      const first = params.map(async ({ mimetype, key, body, bucket_name }) => {
        return await s3.send(
          new PutObjectCommand({
            ContentType: mimetype,
            Key: key,
            Bucket: bucket_name,
            Body: body,
          })
        );
      });
      // uploading file to bucket
      const second = await Promise.all(first);
      // saving file details to database
      if (second) {
        const third = params.map(async ({ mimetype, key, url }) => {
          return await MediaModel.create({ mimetype, key, url });
        });
        const fourth = await Promise.all(third);
        const resultArr = [];
        if (fourth) {
          fourth.forEach(({ value }) => resultArr.push(value._id));
        }
        return res.json(genRes({ msg: resultArr }));
      }
    } else {
      // single file upload
      const { mimetype, key, url, body, bucket_name } =
        mediaMetadataConstructor(obj);
      const first = await s3.send(
        new PutObjectCommand({
          ContentType: mimetype,
          Key: key,
          Bucket: bucket_name,
          Body: body,
        })
      );
      const { httpStatusCode } = first.$metadata;
      if (httpStatusCode == 200) {
        const media = await MediaModel.create({ mimetype, key, url });
        res.json(genRes({ msg: { id: media._id } }));
      } else {
        return next(genError("something went wrong"));
      }
    }
  } catch (error) {
    return next(genError(error.message));
  }
}; 