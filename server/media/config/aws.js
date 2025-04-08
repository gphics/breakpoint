const { S3Client } = require("@aws-sdk/client-s3");

const aws_data = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

module.exports = new S3Client(aws_data);
