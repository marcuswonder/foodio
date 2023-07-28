const { Configuration, OpenAIApi } = require("openai");
const https = require('https');
const fs = require('fs');
const { uploadFile } = require("./s3Client.js");
const { compile } = require("ejs");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


async function aiImageGenerator(recipe) {
    try {
      console.log("AI: Try Block Hit")
        const response = await openai.createImage({
            prompt: `A photorealistic image taken from an angle with a slightly blurred background of a ${recipe.name} meal served on a round white plate on a farmhouse style wooden table.`,
            n: 1,
            size: "1024x1024",
        });
        
        const image_url = response.data.data[0].url;
        console.log("image_url", image_url);

        // const image_url = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-zdNlhRH62O5xGQanL0bQuaVd/user-OtqanphKb4HFH1onIEHti457/img-QIONmqJtKpRPTFCnhMSOde26.png?st=2023-07-28T13%3A44%3A15Z&se=2023-07-28T15%3A44%3A15Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-07-27T15%3A35%3A25Z&ske=2023-07-28T15%3A35%3A25Z&sks=b&skv=2021-08-06&sig=eeewYW2V83zPRNYpTPGTH8uLKNxueX8Rd%2BpIInU3Tqk%3D"
  
        const imageData = await downloadImage(image_url);
        console.log("AI: imageData", imageData)

        const tempFileName = `temp-${Date.now()}`;

        if (!fs.existsSync('../public/temp')) {
          fs.mkdirSync('../public/temp', { recursive: true });
        }

        fs.writeFileSync(`../public/temp/${tempFileName}`, imageData);
        console.log("AI: writeFileSync complete")
        
        const buffer = fs.readFileSync(`../public/temp/${tempFileName}`);      
        console.log("AI: buffer", buffer)

        let imageDataForUpload = {}
          imageDataForUpload.originalname = recipe.name,
          imageDataForUpload.buffer = buffer
          console.log("AI: imageDataForUpload", imageDataForUpload)
  
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
  



module.exports = { aiImageGenerator }