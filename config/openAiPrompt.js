function generateChatGPTPrompt(parsedHTML) {
    const prompt = `I want you to follow my instructions step-by-step. Do not move on from one step to the next until you have completed the full step.
  
  1. Firstly, please review this content which is parsed HTML taken from a food blog ${parsedHTML}
  
  2. Secondly, I want you to return suitable text for the following elements:
  - name: the name of the recipe
  - description: a short description of the recipe, roughly 100 words
  
  Do not return me any information at this stage - remember the name and description for later use.
  
  3. Secondly, I want you to search for a list of ingredients. Most food blogs will provide an handy list of ingredients which we can refer to. 
  
  Do not return me a list of ingredients at this stage - remember the list of ingredients for use in the next step.
  
  4. Now that you have the list, I want you to compile an array of objects for each ingredient following this pattern:
  ingredients [
      ingredient: { 
          qty: Number, // mandatory
          unit: 'String', // mandatory
          ingredient: 'String', // mandatory
          preparation: 'String' // optional
      },
  ]
  
  If you did not find a list, please do your best to compile the ingredients into a an object as best you can. 
  
  You will need to compile each ingredient object one-by-one, repeat this step for each ingredient in the recipe following these guidelines as you compile the object:
  
  A. When selecting a 'unit' for the ingredient objects, you must choose from the following options:
  - Sprinkle
  - Pinch(es)
  - Bunch(es)
  - Handful(s)
  - Piece(s)
  - Ounce(s)
  - Pound(s)
  - Gram(s)
  - Kilogram(s)
  - Teaspoon(s)
  - Tablespoon(s)
  - Cup(s)
  - Millilitre(s)
  - Litre(s)
  - Fluid Ounce(s)
  
  B. If you cannot detect a  unit for a specific ingredient, please default to 'Piece(s)' which relates to one of that object, and do your best to determine the correct quantity.  Please note that any selection outside of the list above will cause a save error in the database. If you come across an ingredient where there is a specific unit which is not included in the list above, for example '1 Bottle of beer' please return it as follows:
  ingredient: { 
      qty: 1, 
      unit: 'Piece(s)',
      ingredient: 'Bottle of beer', 
      preparation: null 
  }  
  
  Or, alternatively, it could be compiled as
  ingredient: { 
      qty: 2, 
      unit: 'Fluid Ounce(s)',
      ingredient: 'Bottle of beer', 
      preparation: null 
  }  
  
  C. If a recipe provides a range of an ingredient, for example '2-3 cups cubed butternut squash', please enter in the middle value of that range, in this case it would be:
  ingredient: { 
      qty: 2.5, 
      unit: 'Cup(s)',
      ingredient: Butternut Squash, 
      preparation: 'Cubed' 
  } 
  
  D. If the recipe asks for 'a' thing, for example 'a bunch of...' or 'a pinch of...', please default to a qty of 1. D. If the recipe asks for 'a couple of' things, please default to a qty of 2. D. If the recipe asks for 'a few...' of a thing, for example 'a few sprigs of thyme, please default to a qty of 3.
  
  E. When selecting a 'unit' for the ingredient, you must choose one of the following options:
  - Sprinkle
  - Pinch(es)
  - Bunch(es)
  - Handful(s)
  - Piece(s)
  - Ounce(s)
  - Pound(s)
  - Gram(s)
  - Kilogram(s)
  - Teaspoon(s)
  - Tablespoon(s)
  - Cup(s)
  - Millilitre(s)
  - Litre(s)
  - Fluid Ounce(s)
  
  Please note that any selection outside of this list will cause a save error in the database. 
  
  F. The 'preparation' should be for specific instruction related to the preparation of an ingredient. For example, 'one roughly chopped white onion' should be compiled like this: 
  ingredient: { 
      qty: 1, 
      unit: 'Piece(s),
      ingredient: 'White Onion', 
      preparation: 'Roughly chopped' 
  } 
  
  Do not return me the array of ingredient objects at this stage - remember them for later use.
  
  4. I want you to select the most appropriate category of meal/drink that this recipe is discussing; you must choose from the following options:
  - Snack
  - Starter
  - Side
  - Main Course
  - Desert 
  - Cocktail
  
  Please note that any selection outside of this list will cause a save error in the database so make your best judgement.
  
  Do not return me your category at this stage - remember your categorty selection for later use.
  
  
  5. For any recipe, most food blogs will explicitly provide the preparation time, cooking time, and the number of people that it will serve. I want you to search for these and return the appropriate values:
      - prepTime: the amount of time it will take to prepare the ingredients for the meal in minutes, formatted in numbers
      - cookTime: the amount of time it will take to cook the meal in minutes, formatted in numbers
      - servings: the number of people the meal will serve
  
      Do not return me your prepTime, cookTime, or servings at this stage - remember the prepTime, cookTime, and servings selection for later use.
  
  
  6. Please review the instructions of the recipe and compile them into an array, following this format:
      instructions: [{
              instruction: {
                  type: String}
          }],
  
  Please summarise sentences and improve grammar, including capitalisation, if you feel it would be more succinct.
  
  Do not return me the array of instructions at this stage - remember them for use in the next step.
  
  
  7. Finally, I want you to combine all the information that you have retrieved and return me the object which will be saved into a database according to the following the model: 
  
  recipe {
      name: {
          type: String,
          required: true
      },
      description: {
          type: String
      },
      category: {
          type: String
          required: true
      },
      prepTime: {
          type: Number,
          min: 0,
          max: 1000
      },
      cookTime: {
          type: Number,
          min: 0,
          max: 1000
      },
      servings: {
          type: Number,
          min: 1,
          max: 24
      },
      ingredients: [{
          ingredient: { type: String },
          qty: { type: Number },
          unit: { type: String },
          preparation: { type: String }
      }],
      instructions: [{
          instruction: {
              type: String}
      }]
  }
  
  Please do not explain how you have come to your decisions; I need an object that I will be able to save into my database directly. Please name the object recipe and ensure that it follows the model above.`

 return prompt 
}

module.exports = { generateChatGPTPrompt }