const { S3Client, PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const https = require('https');
const fs = require('fs');

const s3Client = new S3Client({
  region: 'eu-west-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const uploadFile = async (file) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    
    const Location = `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`;

    return {Location};

  } catch (err) {
    console.log('Error occurred while trying to upload to S3 bucket', err);
    return
  }
};

async function manuallyUploadFile(image_url, recipe) {
  const buffer = await downloadImage(image_url);
  
  let imageDataForUpload = {}
    imageDataForUpload.originalname = recipe.name,
    imageDataForUpload.buffer = buffer

  const result = await uploadFile(imageDataForUpload);
  return result
}

async function downloadImage(image_url) {
  return new Promise((resolve, reject) => {
    https.get(image_url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch image. Status code: ${response.statusCode}`));
        return;
      }

      const chunks = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function deleteImageFromS3(photoLink) {
  console.log("S3: deleteImageFromS3 photoLink", photoLink)

  const photoKey = new URL(photoLink).pathname.substring(1)
  console.log(photoKey)

  const params = {
      Bucket: process.env.S3_BUCKET,
      Key: photoKey
  };

  const deleteObjectCommand = new DeleteObjectCommand(params);

  try {
    const data = await s3Client.send(deleteObjectCommand);
    console.log("Successfully deleted the photo from S3.", data);
  } catch (err) {
    console.error("Error deleting the photo:", err);
  } 
}

module.exports = { s3Client, uploadFile, manuallyUploadFile, deleteImageFromS3 }