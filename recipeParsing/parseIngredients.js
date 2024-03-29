function parseIngredients(ingredientsQuantitiesAndMeasures) {
    console.log("Cheerio: parseIngredients ingredientsQuantitiesAndMeasures", ingredientsQuantitiesAndMeasures)

    let ingredients = []
    for(let ingredientString of ingredientsQuantitiesAndMeasures) {
        const result = {};
        
        // remove leading unhelpful words
        ingredientString = removeUnhelpfulWords(ingredientString)

        // split ingredientString into array
        const splitIngredient = ingredientString.split(" ")

        // remove x from strings where "[num] x [ingredient]"
        if(splitIngredient[1] === "x") {
            splitIngredient.splice(1,1)
        }

        console.log("Cheerio: splitIngredient", splitIngredient)

        // check if first item in the array is fraction
        if (splitIngredient[0] in fractionMapping) {
            
            let qty = fractionMapping[splitIngredient[0]]
            result.qty = qty

            // Check if second item matches unitMapping key, return value
            if (splitIngredient[1] in unitMapping) {
                let unit = unitMapping[splitIngredient[1]]; 
                result.unit = unit

                // Remove first and second items. Combine remaining items for regex comparison.
                splitIngredient.splice(0,2)
                const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                result.ingredient = splitIngredientAndPreparation[0]
                
                // splice ingredient and combine remaining elements in case of commas in preparation
                splitIngredientAndPreparation.splice(0,1)
                const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                result.preparation = combinedPreparation || ''
            
            } else {
                result.unit = 'Piece(s)'
                splitIngredient.splice(0,1)
                const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                result.ingredient = splitIngredientAndPreparation[0]
                 
                // splice ingredient and combine remaining elements in case of commas in preparation
                splitIngredientAndPreparation.splice(0,1)
                const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                result.preparation = combinedPreparation || ''
            }
            
        // check if first item in the array contains "-" and average range
        } else if(splitIngredient[0].includes('-')) {
            let qty = findAverageNumberFromRange(splitIngredient[0])   
            result.qty = qty

            // Check if second item matches unitMapping key, return value
            if (splitIngredient[1] in unitMapping) {
                let unit = unitMapping[splitIngredient[1]]; 
                result.unit = unit

                // Remove first and second items. Combine remaining items for regex comparison.
                splitIngredient.splice(0,2)
                const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                result.ingredient = splitIngredientAndPreparation[0]
                
                // splice ingredient and combine remaining elements in case of commas in preparation
                splitIngredientAndPreparation.splice(0,1)
                const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                result.preparation = combinedPreparation || ''
            
            } else {
                result.unit = 'Piece(s)'
                splitIngredient.splice(0,1)
                const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                result.ingredient = splitIngredientAndPreparation[0]
                 
                // splice ingredient and combine remaining elements in case of commas in preparation
                splitIngredientAndPreparation.splice(0,1)
                const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                result.preparation = combinedPreparation || ''
            }

        // check if first item holds numbers only
        } else if(containsNumbers(splitIngredient[0]) && !containsLetters(splitIngredient[0])) {
            result.qty = Number(splitIngredient[0])

            // Check if second item matches unitMapping key, return value
            if (splitIngredient[1] in unitMapping) {
                let unit = unitMapping[splitIngredient[1]]; 
                result.unit = unit

                // Remove first and second items. Combine remaining items for regex comparison.
                splitIngredient.splice(0,2)
                const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                result.ingredient = splitIngredientAndPreparation[0]
                 
                // splice ingredient and combine remaining elements in case of commas in preparation
                splitIngredientAndPreparation.splice(0,1)
                const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                result.preparation = combinedPreparation || ''
                
            } else {
                result.unit = 'Piece(s)'
                splitIngredient.splice(0,1)
                const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                result.ingredient = splitIngredientAndPreparation[0]
                 
                // splice ingredient and combine remaining elements in case of commas in preparation
                splitIngredientAndPreparation.splice(0,1)
                const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                result.preparation = combinedPreparation || ''
            }
            

        // check whether the first item in the array contains numbers and letters
        } else if(containsNumbers(splitIngredient[0]) && containsLetters(splitIngredient[0])) {
            
            // split numbers and letters, remove original element and insert numbers and letters at start of array
            const regex = /(\d+)([a-zA-Z]+)/;
            const [, numbers, letters] = splitIngredient[0].match(regex)
            splitIngredient.unshift(numbers, letters)
            splitIngredient.splice(2, 1);

            // check if first item holds numbers only
            if(containsNumbers(splitIngredient[0]) && !containsLetters(splitIngredient[0])) {
                result.qty = Number(splitIngredient[0])

                // Check if second item matches unitMapping key, return value
                if (splitIngredient[1] in unitMapping) {
                    let unit = unitMapping[splitIngredient[1]]; 
                    result.unit = unit

                    // Remove first and second items. Combine remaining items for regex comparison.
                    splitIngredient.splice(0,2)
                    const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                    result.ingredient = splitIngredientAndPreparation[0]
                     
                    // splice ingredient and combine remaining elements in case of commas in preparation
                    splitIngredientAndPreparation.splice(0,1)
                    const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                    result.preparation = combinedPreparation || ''

                    
                } else {
                    result.unit = 'Piece(s)'
                    splitIngredient.splice(0,1)
                    const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
                    result.ingredient = splitIngredientAndPreparation[0]
                    
                    // splice ingredient and combine remaining elements in case of commas in preparation
                    splitIngredientAndPreparation.splice(0,1)
                    const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
                    result.preparation = combinedPreparation || ''
                }
            }
        
        } else {
            result.qty = 1
            result.unit = 'Piece(s)'
            result.preparation = ''

            const splitIngredientAndPreparation = combineArrayElementsWithSpaces(splitIngredient).split(", ")
            result.ingredient = splitIngredientAndPreparation[0]
                
            // splice ingredient and combine remaining elements in case of commas in preparation
            splitIngredientAndPreparation.splice(0,1)
            const combinedPreparation = combineArrayElementsWithSpaces(splitIngredientAndPreparation)
            result.preparation = combinedPreparation || ''

        }
        ingredients.push(result)
        // console.log("Cheerio: getBbcGoodFoodRecipe ingredients", ingredients)
    }
    return ingredients
}

  
const unhelpfulWords = ["about ", "roughly "];

function removeUnhelpfulWords(ingredient) {
    let result = ingredient;
    for(let word of unhelpfulWords) {
        let pattern = new RegExp("^" + word);
        result = result.replace(pattern, "");
    }
    return result;
}

function containsNumbers(string) {
    const hasNumbers = /\d/.test(string);
    return hasNumbers
}

function containsLetters(string) {
    const hasLetters = /[a-zA-Z]/.test(string);
    return hasLetters;
}

function combineArrayElementsWithSpaces(arr) {
    let result = "";
    for(let i = 0; i < arr.length; i++) {
        result += arr[i];
        if(i < arr.length - 1 && arr[i+1] !== ",") {
            result += " ";
        }
    }
    return result;
}



const unitMapping = {
    'piece': 'Piece(s)',
    'pieces': 'Piece(s)',
    'sprinkle': 'Sprinkle',
    'pinch' : 'Pinch(es)',
    'pinches' : 'Pinch(es)',
    'bunch' : 'Bunch(es)',
    'bunches' : 'Bunch(es)',
    'handful' : 'Handful(s)',
    'handfuls' : 'Handful(s)',
    'ounce': 'Ounce(s)',
    'ounce': 'Ounce(s)',
    'ounce': 'Ounce(s)',
    'ounces': 'Ounce(s)',
    'pound': 'Pound(s)',
    'pounds': 'Pound(s)',
    'gram': 'Gram(s)',
    'grams': 'Gram(s)',
    'kilogram': 'Kilogram(s)',
    'kilograms': 'Kilogram(s)',
    'teaspoon': 'Teaspoon(s)',
    'teaspoons': 'Teaspoon(s)',
    'tablespoon': 'Tablespoon(s)',
    'tablespoons': 'Tablespoon(s)',
    'cup': 'Cup(s)',
    'cups': 'Cup(s)',
    'millilitre': 'Millilitre(s)',
    'millilitres': 'Millilitre(s)',
    'litre': 'Litre(s)',
    'litres': 'Litre(s)',
    'fluid ounce': 'Fluid Ounce(s)',
    'fluid ounces': 'Fluid Ounce(s)',
    'oz': 'Ounce(s)',
    'ozs': 'Ounce(s)',
    'lb': 'Pound(s)',
    'lbs': 'Pound(s)',
    'g': 'Gram(s)',
    'gs': 'Gram(s)',
    'kg': 'Kilogram(s)',
    'kgs': 'Kilogram(s)',
    'tsp': 'Teaspoon(s)',
    'tsps': 'Teaspoon(s)',
    'tbsp': 'Tablespoon(s)',
    'tbsps': 'Tablespoon(s)',
    'cup': 'Cup(s)',
    'cups': 'Cup(s)',
    'ml': 'Millilitre(s)',
    'mls': 'Millilitre(s)',
    'l': 'Litre(s)',
    'ls': 'Litre(s)',
    'floz': 'Fluid Ounce(s)',
    'flozs': 'Fluid Ounce(s)',
    'fl oz': 'Fluid Ounce(s)',
    'fl ozs': 'Fluid Ounce(s)',
  }

  const fractionMapping = {
    '½' : .5,
    '1⁄2' : .5,
    '1/2' : .5,
    '¾' : .75,
    '3⁄4' : .75,
    '3/4' : .75,
    '¼' : .25,
    '1⁄4' : .25,
    '1/4' : .25,
    '⅔' : .666,
    '2⁄3' : .666,
    '2/3' : .666,
    '⅓' : .333,
    '1⁄3' : .333,
    '1/3' : .333,
    '⅕' : .2,
    '1⁄5' : .2,
    '1/5' : .2,
    '⅖' : .4,
    '2⁄5' : .4,
    '2/5' : .4,
    '⅗' : .6,
    '3⁄5' : .6,
    '3/5' : .6,
    '⅘' : .8,
    '4⁄5' : .8,
    '4/5' : .8,
}

module.exports = { parseIngredients }