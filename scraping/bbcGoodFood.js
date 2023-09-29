const { timeStringToMinutes, findAverageNumberFromRange } = require('../recipeParsing/parseTimes')

async function getBbcGoodFoodRecipe($, $ingredients, $instructions) { 
    try {
        // const response = await axios.get(recipeLink)
        // const $ = cheerio.load(response.data)

        // photoLink
        const photoSrcset = $('.post-header-image .image__container .image__picture source[type="image/webp"]').attr('srcset')
        
        let photoUrls = photoSrcset ? photoSrcset.split(',') : []
        let photoLink = photoUrls.length > 0 ? photoUrls[4] : ''

        // Name
        const name = $('.post-header__title > h1').text()
        
        // Description
        const description = $('.post-header__body div:nth-child(6) > p').text()
        
        // Prep & Cook Times
        const prepTimeString = $('.post-header__planning time').first().text()
        const prepTime = timeStringToMinutes(prepTimeString)
        
        const cookTimeString = $('.post-header__planning time').last().text()
        
        const cookTime = timeStringToMinutes(cookTimeString)
        
        // Servings
        const servingsFullString = $('.post-header__servings').text()
        // console.log("BBCGoodFood: servingsFullString", servingsFullString)

        const servingsNumString = servingsFullString.replace("Serves ","")
        // console.log("BBCGoodFood: servingsNumString", servingsNumString)

        const servings = findAverageNumberFromRange(servingsNumString)

        // Ingredients
        let ingredients = []

        $ingredients('section').each(function() {
            $(this).find('li').each(function() {
                const ingredient = $(this).text().trim()
                ingredients.push({ingredient})
            })
        })
        
        // console.log("BBCGoodFood: getBbcGoodFoodRecipe ingredients", ingredients)
        
        // Instructions

        let unformattedInstructions = []

        $instructions('li').each((index, element) => {
            unformattedInstructions.push($(element).text())
        })
        
        let formattedInstructions = unformattedInstructions.map(instruction => instruction.replace(/STEP \d+/, ''))
        let instructions = []

        for(let i = 0; i < formattedInstructions.length; i++) {
            let instructionObj = {instruction: formattedInstructions[i]}
            instructions.push(instructionObj)
        }
        
        let recipe = {
            name: name,
            description: description,
            prepTime: prepTime,
            cookTime: cookTime,
            servings: servings,
            ingredients: ingredients,
            instructions: instructions,
            photo: photoLink,
        }

        return recipe
        
            
    } catch (error) {
        console.log("BBCGoodFood: Error retrieving HTML", error)
    }
}

module.exports = { getBbcGoodFoodRecipe }