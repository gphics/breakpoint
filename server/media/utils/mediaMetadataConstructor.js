module.exports = (obj) => {
  const mimetype = obj.mimetype;
  const size = Math.ceil(obj.size / 1024 / 1024);
  const name = obj.name;
  const date = new Date();
  const rnd = Math.floor(Math.random() * obj.size).toString();
  const key = `${name}-${rnd}-${date.getMilliseconds() * rnd.toString()}`;
  const bucket_name = process.env.AWS_BUCKET_NAME;
  const aws_region = process.env.AWS_REGION;
  const url = `https://${bucket_name}.s3.${aws_region}.amazonaws.com/${key}`;
  const body = obj.data;

  return { mimetype, size: `${size}mb`, name, key, bucket_name, url, body };
};
