const { Configuration, OpenAIApi } = require("openai");
const https = require('https');

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// async function aiTextResponse (prompt) {
//     const response = await openai.createChatCompletion({
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: "Hello world" }],
//     })
//     console.log(response.data.choices[0].text)
// }

async function aiImageGenerator(recipeName) {
    console.log("recipeName", recipeName)
    try {
        console.log("openAI try block hit")
        const response = await openai.createImage({
            prompt: recipeName,
            // prompt: 'Lamb Rogan Josh',
            n: 1,
            size: "1024x1024",
        })
        image_url = response.data.data[0].url
        console.log("image_url", image_url)
        fetchImageFromUrl(image_url)
        
    } catch(error) {
        console.log("openAI catch block hit")
        console.log("error.response.status", error.response.status)
        console.log("error.response.data", error.response.data)
    }
}



module.exports = { aiImageGenerator }