// async function AiIngredientQuery(ingredientsArray) {
    // // Generate Prompt
    // const prompt = generateChatGPTPrompt(ingredientsArray)
    // // console.log("Cheerio: AiIngredientQuery prompt", prompt)

    // // Make OpenAI API Call
    // let AiResponse = await chatGPTQuery(prompt)

    // // Parse AI Response
    // // AiResponse = AiResponse.replace('var ingredients = ', '').trim()
    // // AiResponse = AiResponse.substring(0, AiResponse.lastIndexOf(';'))

    // // console.log("Cheerio: AiIngredientQuery AiResponse after removal of JS", AiResponse)

    // let parsedAiIngredients
    // try {
    //     parsedAiIngredients = JSON.parse(AiResponse);
    
    // } catch (error) {
    //     console.error("Cheerio: Error parsing JSON in AiIngredientQuery", error);
    // }

    // return parsedAiIngredients
// }