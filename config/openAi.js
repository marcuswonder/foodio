const axios = require('axios');
const { Configuration, OpenAIApi } = require("openai");
const https = require('https');
const fs = require('fs');
const { uploadFile } = require("./s3Client.js");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


async function aiImageGeneratorAndS3Upload(recipe) {
  try {
    let prompt
  
    if(recipe.category !== "Cocktail") {
      prompt = `A photorealistic image taken from an angle with a slightly blurred background of a ${recipe.name} ${recipe.category} served on a round white plate on a farmhouse style wooden table.`;

    } else {      
      prompt = `A photorealistic image taken from an angle with a slightly blurred background of a ${recipe.name} ${recipe.category} served on a silver a coaster on a wooden bar top.`;
    }
      const response = await openai.createImage({
          prompt: prompt,
          n: 1,
          size: "1024x1024",
      });
      
      const image_url = response.data.data[0].url;
      const buffer = await downloadImage(image_url);
      
      let imageDataForUpload = {}
        imageDataForUpload.originalname = recipe.name,
        imageDataForUpload.buffer = buffer

      const result = await uploadFile(imageDataForUpload);
      return result
      
  
  } catch(error) {
    console.log("AI: Catch Error Hit", error)
  }
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


module.exports = { aiImageGeneratorAndS3Upload }