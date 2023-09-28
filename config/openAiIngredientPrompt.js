function generateChatGPTPrompt(ingredientsArray) {

    const ingredientsString = JSON.stringify(ingredientsArray)

    const prompt = `

    Acting as a data scientist and food blogger, review and compile the following ingredients into an array of objects based on the given guidelines: ${ingredientsString}

    Guidelines:
    1. Output Format: Return only the array of ingredients, without any additional text or the array name. Ensure the output matches the following model:
    [
        {
            qty: {type: Number, required: true), 
            unit: {type: String, required: true), 
            ingredient: {type: String, required: true},
            preparation: {type: String)
        },
    ]

    2. Quantity Ranges: For ranges like '2-3 cups', use the average value (e.g., 2.5 cups).

    3. Units: correctly recognise and identify the correct units - all units MUST be from this list: Sprinkle, Pinch(es), Bunch(es), Handful(s), Piece(s), Ounce(s), Pound(s), Gram(s), Kilogram(s), Teaspoon(s), Tablespoon(s), Cup(s), Millilitre(s), Litre(s), Fluid Ounce(s), Can(s), Bottle(s).

    If a specific unit is not listed, please use 'Piece(s)' to denote a whole object.

    4. Preparation Instructions: The 'preparation' field should capture any adverbs or adjectives that describe the ingredient's preparation, typically appearing after a comma. For example, "one white onion, thinly sliced" would be compiled as follows:
    {
        qty: 1
        unit: Piece(s)
        ingredient: 'white onion'
        preparation: 'thinly sliced'
    }
    `

    return prompt 
}

module.exports = { generateChatGPTPrompt }