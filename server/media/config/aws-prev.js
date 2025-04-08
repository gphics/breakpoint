// const aws_data = {
//   bucket: process.env.AWS_BUCKET_NAME,
//   region: process.env.AWS_REGION,
//   access_key: process.env.AWS_ACCESS_KEY,
//   secret_key: process.env.AWS_SECRET_ACCESS_KEY,
// };
const AWS = require("aws-sdk");
const aws_data = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const s3 = new AWS.S3({
  credentials: aws_data,
});

// const params = {
//     bucketName, key(filename), body(file.data)
// }

console.log(s3);