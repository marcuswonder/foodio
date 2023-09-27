function generateChatGPTPrompt(ingredientsArray) {

    const ingredientsString = JSON.stringify(ingredientsArray)

    const prompt = `
    Your Preparation for this task:
    Learn to recognise the shorthand for units of measurement commonly used in cooking found in the list below - the format of the list is "Unit of Measurement = 'shorthand option 1', 'shorthand option 2', 'shorthand option 3' etc.":
        - Bunch(es) = 'bunch', 'bunches'
        - Cup(s) = 'cup', 'cups', 'cup', 'cups'
        - Fluid Ounce(s) = 'fluid ounce', 'fluid ounces', 'floz', 'flozs', 'fl oz', 'fl ozs'
        - Gram(s) = 'gram', 'grams', 'g', 'gs'
        - Handful(s) = 'handful', 'handfuls'
        - Kilogram(s) = 'kilogram', 'kilograms', 'kg', 'kgs'
        - Litre(s) = 'litre', 'litres', 'l', 'ls'
        - Millilitre(s) = 'millilitre', 'millilitres', 'ml', 'mls'
        - Ounce(s) = 'ounce', 'ounce', 'ounce', 'ounces', 'oz', 'ozs'
        - Piece(s) = 'piece', 'pieces'
        - Pinch(es) = 'pinch', 'pinches'
        - Pound(s) = 'pound', 'pounds', 'lb', 'lbs'
        - Sprinkle = 'sprinkle'
        - Tablespoon(s) = 'tablespoon', 'tablespoons', 'tbsp', 'tbsps'
        - Teaspoon(s) = 'teaspoon', 'teaspoons', 'tsp', 'tsps'

    Compile the following ingredients into an array of objects based on the given guidelines:

    Ingredients: ${ingredientsString}

    Guidelines:
    1. Units: Use your preparation for this task to correctly recognise and identify the correct units  - all units MUST be from this list: Sprinkle, Pinch(es), Bunch(es), Handful(s), Piece(s), Ounce(s), Pound(s), Gram(s), Kilogram(s), Teaspoon(s), Tablespoon(s), Cup(s), Millilitre(s), Litre(s), Fluid Ounce(s).

        Example: '2 tsps sugar' should be converted to:
        {
            qty: 2,
            unit: Teaspoon(s),
            ingredient: sugar,
        },
        
    2. Quantity Ranges: For ranges like '2-3 cups', use the average value (e.g., 2.5 cups).

    3. General Quantities:
        - For 'a' thing, use qty: 1.
        - For 'a couple of', use qty: 2.
        - For 'a few', use qty: 3.
    
    4. Preparation Instructions: The 'preparation' field should capture any adverbs or adjectives that describe the ingredient's preparation, typically appearing after a comma. For example, "thinly sliced".
    
    5. Output Format: Return only the array of ingredients, without any additional text or the variable name 'ingredients'. Ensure the output matches the following model:
    {
        qty: { type: Number, required: true },
        unit: { type: String, required: true },
        ingredient: { type: String, required: true },
        preparation: { type: String }
    },`

    return prompt 
}

module.exports = { generateChatGPTPrompt }