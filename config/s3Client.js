const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const uploadFile = async (file) => {
  console.log("S3: file", file)
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
    // ACL: 'public-read'
  };
  console.log("S3: params", params)

  try {
    const data = await s3Client.send(new PutObjectCommand(params));
    console.log("Response", data)
    
    const Location = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    return {Location};

  } catch (err) {
    console.log('Error occurred while trying to upload to S3 bucket', err);
  }
};

module.exports = { s3Client, uploadFile }